import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy" },
  description:
    "What tech.regardless Front Desk collects when you text a business that uses it, why, how long we keep it, and how to opt out.",
  alternates: { canonical: "/privacy" },
};

const CONTACT = "ali@techregardless.com";
const UPDATED = "October 13, 2026";

export default function PrivacyPage() {
  return (
    <article className="border-b border-border py-24 sm:py-32">
      <div className="container-wide max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          tech.regardless
        </p>
        <h1 className="mt-4 text-balance text-4xl font-medium tracking-tight sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          This policy covers tech.regardless and its Front Desk service, the
          text message assistant that replies when you call a local business
          and they can&apos;t pick up. It explains what happens with your
          information when you text with it.
        </p>
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          Last updated {UPDATED}
        </p>

        <div className="mt-12 space-y-10 text-base leading-relaxed text-foreground/85">
          <div>
            <h2 className="text-xl font-medium tracking-tight">What we collect</h2>
            <p className="mt-3">When you text with a business that uses Front Desk, we collect:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>your phone number</li>
              <li>your name</li>
              <li>your service address</li>
              <li>the content of your messages</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-medium tracking-tight">Why we collect it</h2>
            <p className="mt-3">
              To help the business you called schedule your service request.
              Nothing else.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-medium tracking-tight">Who sees it</h2>
            <p className="mt-3">
              We do not sell or share your SMS opt-in data or personal
              information with third parties for marketing purposes.
            </p>
            <p className="mt-3">
              Messages are processed by our service provider (Twilio) to send
              and receive texts, and by an AI assistant that drafts replies.
              The business you contacted sees your request so they can
              schedule it.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-medium tracking-tight">Opting out</h2>
            <p className="mt-3">
              Reply <strong>STOP</strong> at any time and we&apos;ll stop
              texting you. Reply <strong>HELP</strong> for help.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-medium tracking-tight">How long we keep it</h2>
            <p className="mt-3">12 months, then deleted.</p>
          </div>
          <div>
            <h2 className="text-xl font-medium tracking-tight">Contact</h2>
            <p className="mt-3">
              Questions:{" "}
              <a href={`mailto:${CONTACT}`} className="underline underline-offset-4 hover:text-accent">
                {CONTACT}
              </a>
            </p>
            <p className="mt-3">
              See also our{" "}
              <Link href="/terms" className="underline underline-offset-4 hover:text-accent">
                Terms &amp; Conditions
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
