import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Terms & Conditions" },
  description:
    "The terms for receiving text messages from a business that uses tech.regardless Front Desk: consent, frequency, STOP and HELP, carrier liability.",
  alternates: { canonical: "/terms" },
};

const CONTACT = "ali@techregardless.com";
const UPDATED = "October 13, 2026";

export default function TermsPage() {
  return (
    <article className="border-b border-border py-24 sm:py-32">
      <div className="container-wide max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          tech.regardless
        </p>
        <h1 className="mt-4 text-balance text-4xl font-medium tracking-tight sm:text-5xl">
          Terms &amp; Conditions
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          These terms cover tech.regardless and its Front Desk service, the
          text message assistant that replies when you call a local business
          and they can&apos;t pick up. They explain what you agree to by
          texting with it.
        </p>
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          Last updated {UPDATED}
        </p>

        <section className="mt-12">
          <h2 className="text-3xl font-medium tracking-tight">SMS Terms</h2>
          <div className="mt-8 space-y-10 text-base leading-relaxed text-foreground/85">
            <div>
              <h3 className="text-xl font-medium tracking-tight">What you&apos;re agreeing to</h3>
              <p className="mt-3">
                By replying to a text from a business using Front Desk, you
                agree to receive messages from tech.regardless on that
                business&apos;s behalf about your service request.
              </p>
              <p className="mt-3">
                Message frequency varies by conversation, and message and data
                rates may apply.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium tracking-tight">Cancelling and getting help</h3>
              <p className="mt-3">
                Reply <strong>STOP</strong> to cancel. Reply{" "}
                <strong>HELP</strong> for help.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium tracking-tight">Carriers</h3>
              <p className="mt-3">Carriers are not liable for delayed or undelivered messages.</p>
            </div>
            <div>
              <h3 className="text-xl font-medium tracking-tight">Contact</h3>
              <p className="mt-3">
                Questions:{" "}
                <a href={`mailto:${CONTACT}`} className="underline underline-offset-4 hover:text-accent">
                  {CONTACT}
                </a>
              </p>
              <p className="mt-3">
                See also our{" "}
                <Link href="/privacy" className="underline underline-offset-4 hover:text-accent">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
