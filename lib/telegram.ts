const TELEGRAM_API = "https://api.telegram.org";

function escapeMarkdownV2(text: string) {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, (m) => `\\${m}`);
}

export async function sendTelegramMessage(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log("[telegram] skipped — TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set");
    return { ok: false, skipped: true };
  }

  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "MarkdownV2",
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`[telegram] ${res.status} ${body}`);
      return { ok: false, skipped: false };
    }
    return { ok: true, skipped: false };
  } catch (err) {
    console.error("[telegram] send failed", err);
    return { ok: false, skipped: false };
  }
}

export function formatContactNotification(payload: {
  name: string;
  email: string;
  company?: string;
  projectTypeLabel: string;
  budgetLabel: string;
  message: string;
}) {
  const e = escapeMarkdownV2;
  const lines = [
    "*New project inquiry*",
    "",
    `*Name:* ${e(payload.name)}`,
    `*Email:* ${e(payload.email)}`,
    payload.company ? `*Company:* ${e(payload.company)}` : null,
    `*Type:* ${e(payload.projectTypeLabel)}`,
    `*Budget:* ${e(payload.budgetLabel)}`,
    "",
    "*Message:*",
    e(payload.message),
  ].filter(Boolean);
  return lines.join("\n");
}
