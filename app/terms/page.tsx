import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Front Desk SMS Terms",
  description:
    "Terms for text messages sent through tech.regardless Front Desk: what you agree to by replying, how to cancel, and carrier disclosures.",
  alternates: { canonical: "/terms" },
};

const CONTACT = "ali@techregardless.com";

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="tech.regardless Front Desk SMS Terms"
      intro="Short version: text us about your service request, we text you back about your service request, and you can stop any time."
      updated="October 10, 2026"
      related={{ href: "/privacy", label: "Front Desk SMS Privacy Policy" }}
      sections={[
        {
          heading: "What you're agreeing to",
          body: (
            <>
              <p>
                By replying to a text from a business using Front Desk, you
                agree to receive messages about your service request.
              </p>
              <p>
                Message frequency varies by conversation. Message and data
                rates may apply.
              </p>
            </>
          ),
        },
        {
          heading: "Cancelling and getting help",
          body: (
            <p>
              Reply <strong>STOP</strong> to cancel. Reply{" "}
              <strong>HELP</strong> for help.
            </p>
          ),
        },
        {
          heading: "Carriers",
          body: (
            <p>Carriers are not liable for delayed or undelivered messages.</p>
          ),
        },
        {
          heading: "Contact",
          body: (
            <p>
              Questions:{" "}
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
