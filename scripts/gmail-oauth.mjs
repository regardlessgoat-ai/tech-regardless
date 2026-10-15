#!/usr/bin/env node
/**
 * One-time setup: authorise ali@techregardless.com to send through the Gmail
 * API (gmail.send scope only) and store the credentials in Vercel Production.
 *
 * Nothing is printed, written to disk or passed on a command line:
 *  1. Copy the OAuth client ID (Google Cloud console, copy button). The script
 *     watches the clipboard, takes it and clears the clipboard.
 *  2. Copy the client secret the same way.
 *  3. Chrome opens Google's consent page. Pick ali@techregardless.com, Allow.
 *  4. The refresh token comes back to a local loopback page, and all three
 *     values are piped into `vercel env add ... --sensitive` on stdin.
 *
 * Run from the repo root (it must be linked to the Vercel project):
 *   node scripts/gmail-oauth.mjs
 */
import { execFileSync, spawn } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { createServer } from "node:http";

const SCOPE = "https://www.googleapis.com/auth/gmail.send";
const ACCOUNT = "ali@techregardless.com";
const TIMEOUT_MS = 15 * 60 * 1000;

const CLIENT_ID_RE = /^\d+-[a-z0-9]+\.apps\.googleusercontent\.com$/;
const SECRET_RE = /^GOCSPX-[A-Za-z0-9_-]{10,}$/;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clipboard = () => execFileSync("pbpaste", { encoding: "utf8" }).trim();
const clearClipboard = () => execFileSync("pbcopy", { input: "" });

async function waitForClipboard(re, label) {
  console.log(`Waiting for the ${label} on the clipboard...`);
  const deadline = Date.now() + TIMEOUT_MS;
  while (Date.now() < deadline) {
    const v = clipboard();
    if (re.test(v)) {
      clearClipboard();
      console.log(`Got the ${label}. Clipboard cleared.`);
      return v;
    }
    await sleep(1000);
  }
  throw new Error(`timed out waiting for the ${label}`);
}

function storeInVercel(name, value) {
  return new Promise((resolve, reject) => {
    const child = spawn("vercel", ["env", "add", name, "production", "--sensitive", "--force"], {
      stdio: ["pipe", "ignore", "ignore"],
    });
    child.on("error", reject);
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`vercel env add ${name} exited ${code}`))));
    child.stdin.end(value);
  });
}

async function main() {
  const clientId = await waitForClipboard(CLIENT_ID_RE, "client ID");
  const clientSecret = await waitForClipboard(SECRET_RE, "client secret");

  const state = randomBytes(16).toString("hex");
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");

  const code = await new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url, "http://127.0.0.1");
      if (url.pathname !== "/") return res.writeHead(404).end();
      const ok = url.searchParams.get("state") === state && url.searchParams.get("code");
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(ok ? "Done. You can close this tab and go back to the terminal." : "Authorisation failed. Check the terminal.");
      server.close();
      if (ok) resolve(url.searchParams.get("code"));
      else reject(new Error(`consent failed: ${url.searchParams.get("error") ?? "state mismatch"}`));
    });
    server.listen(0, "127.0.0.1", () => {
      const redirect = `http://127.0.0.1:${server.address().port}`;
      globalThis.redirectUri = redirect;
      const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      auth.search = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirect,
        response_type: "code",
        scope: SCOPE,
        access_type: "offline",
        prompt: "consent",
        login_hint: ACCOUNT,
        state,
        code_challenge: challenge,
        code_challenge_method: "S256",
      }).toString();
      console.log(`Opening Google's consent page in Chrome. Pick ${ACCOUNT} and click Allow.`);
      execFileSync("open", ["-a", "Google Chrome", auth.toString()]);
    });
    setTimeout(() => reject(new Error("timed out waiting for consent")), TIMEOUT_MS).unref();
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      code_verifier: verifier,
      redirect_uri: globalThis.redirectUri,
      grant_type: "authorization_code",
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.refresh_token) {
    throw new Error(`token exchange failed: ${res.status} ${data.error ?? "no refresh token"}`);
  }
  const scopes = String(data.scope ?? "").split(" ");
  if (scopes.length !== 1 || scopes[0] !== SCOPE) {
    throw new Error(`unexpected scopes granted: ${data.scope}`);
  }

  await storeInVercel("GMAIL_CLIENT_ID", clientId);
  await storeInVercel("GMAIL_CLIENT_SECRET", clientSecret);
  await storeInVercel("GMAIL_REFRESH_TOKEN", data.refresh_token);
  console.log("Stored GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN in Vercel Production (Sensitive).");
  console.log("Redeploy Production for them to take effect.");
}

main().catch((err) => {
  console.error(`Failed: ${err.message}`);
  process.exit(1);
});
