import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Front Desk SMS Privacy Policy",
  description:
    "What tech.regardless Front Desk collects when you text a business that uses it, why, how long we keep it, and how to opt out.",
  alternates: { canonical: "/privacy" },
};

const CONTACT = "ali@techregardless.com";

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="tech.regardless Front Desk SMS Privacy Policy"
      intro="Front Desk is the text-message assistant that replies when you call a local business and they can't pick up. This is what happens with your information when you text with it."
      updated="October 10, 2026"
      related={{ href: "/terms", label: "Front Desk SMS Terms" }}
      sections={[
        {
          heading: "What we collect",
          body: (
            <>
              <p>When you text with a business that uses Front Desk, we collect:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>your phone number</li>
                <li>your name</li>
                <li>your service address</li>
                <li>the content of your messages</li>
              </ul>
            </>
          ),
        },
        {
          heading: "Why we collect it",
          body: (
            <p>
              To help the business you called schedule your service request.
              Nothing else.
            </p>
          ),
        },
        {
          heading: "Who sees it",
          body: (
            <>
              <p>
                We don&apos;t sell or share your information with third
                parties for marketing.
              </p>
              <p>
                Messages are processed by our service provider (Twilio) to send
                and receive texts, and by an AI assistant that drafts replies.
                The business you contacted sees your request so they can
                schedule it.
              </p>
            </>
          ),
        },
        {
          heading: "Opting out",
          body: (
            <p>
              Reply <strong>STOP</strong> at any time and we&apos;ll stop
              texting you. Reply <strong>HELP</strong> for help.
            </p>
          ),
        },
        {
          heading: "How long we keep it",
          body: <p>12 months, then deleted.</p>,
        },
        {
          heading: "Contact",
          body: (
            <p>
              Questions about this policy or your data:{" "}
              <a href={`mailto:${CONTACT}`} className="underline underline-offset-4 hover:text-accent">
                {CONTACT}
              </a>
            </p>
          ),
        },
      ]}
    />
  );
}
