// Render every variant of the contact-form emails to HTML files so they can
// be opened in a browser or mail client without submitting the form.
//   npx tsx scripts/preview-emails.tsx [outDir]      (default: .preview-emails/)
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { ResearchAnswers } from "../lib/contact-questions";
import { renderLeadAutoReply, STATIC_INTRO } from "../lib/emails/lead-auto-reply";
import { renderOperatorNotification } from "../lib/emails/operator-notification";
import { firstNameOf, paragraphsOf } from "../lib/emails/shell";

const out = process.argv[2] ?? ".preview-emails";
mkdirSync(out, { recursive: true });

const lead = {
  receivedAt: new Date().toISOString(),
  name: "jordan rivera",
  email: "jordan@example.com",
  phone: "4075550100",
  company: "Rivera Garage Doors",
  projectTypeLabel: "AI Front Desk",
  budget: "2k-5k",
  budgetLabel: "$2k to $5k",
  goal: "stop missing calls while I'm on a job",
  message:
    "We miss maybe a third of our calls during the day because both of us are on installs.\n\nVoicemail doesn't get returned fast enough and I know we're losing jobs to whoever picks up first.",
  research: { findYou: "b", missedCall: "b", booking: "b", callVolume: "b", timing: "b" } as ResearchAnswers,
  utm: { source: "direct", medium: "direct", campaign: "direct" },
};

async function main() {
  const first = firstNameOf(lead.name);
  const files: [string, string][] = [
    ["operator-notification.html", await renderOperatorNotification(lead)],
    // Warm: big budget, no rush. Cold: small budget, no rush, no phone.
    [
      "operator-notification-warm.html",
      await renderOperatorNotification({ ...lead, research: { ...lead.research, timing: "c" } }),
    ],
    [
      "operator-notification-cold.html",
      await renderOperatorNotification({
        ...lead,
        phone: null,
        company: null,
        budget: "under-1k",
        budgetLabel: "Under $1k",
        research: { ...lead.research, timing: "d" },
        utm: { source: "cold-email", medium: "email", campaign: "hvac-osceola" },
      }),
    ],
    [
      "lead-auto-reply-static.html",
      await renderLeadAutoReply({ firstName: first, intro: STATIC_INTRO, ...lead }),
    ],
    [
      "lead-auto-reply-ai.html",
      await renderLeadAutoReply({
        firstName: first,
        intro: paragraphsOf(
          "Thanks for the detail, Jordan. Missing a third of calls while you're both on installs is exactly the gap the front desk covers: it texts the caller back within seconds and asks for the job details so nothing sits in voicemail.\n\nTwo quick questions before Ali calls you: are most of those calls new customers or existing ones, and do you want texts to go out from your current business number?\n\nAli reads every reply in this thread and will take over from here.",
        ),
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
