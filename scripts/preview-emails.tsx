// Render both contact-form emails to HTML files so they can be opened in a
// browser or mail client without submitting the form.
//   npx tsx scripts/preview-emails.tsx [outDir]      (default: .preview-emails/)
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { RESEARCH_QUESTIONS } from "../lib/contact-questions";
import { renderLeadAutoReply, STATIC_GREETING } from "../lib/emails/lead-auto-reply";
import { renderOperatorNotification } from "../lib/emails/operator-notification";
import { firstNameOf, paragraphsOf } from "../lib/emails/shell";
import { SITE } from "../lib/utils";

const out = process.argv[2] ?? ".preview-emails";
mkdirSync(out, { recursive: true });

const lead = {
  receivedAt: new Date().toISOString(),
  name: "jordan rivera",
  email: "jordan@example.com",
  phone: "4075550100",
  company: "Rivera Garage Doors",
  projectTypeLabel: "AI Front Desk",
  budgetLabel: "$2k to $5k",
  goal: "stop missing calls while I'm on a job",
  message:
    "We miss maybe a third of our calls during the day because both of us are on installs.\n\nVoicemail doesn't get returned fast enough and I know we're losing jobs to whoever picks up first.",
  research: RESEARCH_QUESTIONS.map((q) => [q.question, q.options.b] as const),
  utm: { source: "direct", medium: "direct", campaign: "direct" },
};

async function main() {
  const first = firstNameOf(lead.name);
  const files: [string, string][] = [
    ["operator-notification.html", await renderOperatorNotification(lead)],
    [
      "lead-auto-reply-static.html",
      await renderLeadAutoReply({ firstName: first, greeting: STATIC_GREETING, signature: [`— ${SITE.name}`], ...lead }),
    ],
    [
      "lead-auto-reply-ai.html",
      await renderLeadAutoReply({
        firstName: first,
        greeting: paragraphsOf(
          "Thanks for the detail, Jordan. Missing a third of calls while you're both on installs is exactly the gap the front desk covers: it texts the caller back within seconds and asks for the job details so nothing sits in voicemail.\n\nTwo quick questions before Ali calls you: are most of those calls new customers or existing ones, and do you want texts to go out from your current business number?\n\nAli reads every reply in this thread and will take over from here.",
        ),
        signature: ["— the tech.regardless front desk", `Ali reads every reply. ${SITE.url}`],
        ...lead,
      }),
    ],
  ];
  for (const [name, html] of files) {
    writeFileSync(join(out, name), html);
    console.log(`wrote ${join(out, name)} (${html.length} bytes)`);
  }
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
