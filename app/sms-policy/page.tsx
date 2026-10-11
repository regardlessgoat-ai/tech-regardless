import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Front Desk SMS Privacy Policy and Terms",
  description:
    "What tech.regardless Front Desk collects when you text a business that uses it, how to opt out, and the terms for receiving those messages.",
  alternates: { canonical: "/sms-policy" },
};

const CONTACT = "ali@techregardless.com";
const UPDATED = "October 11, 2026";

function Contact() {
  return (
    <p>
      Questions:{" "}
      <a href={`mailto:${CONTACT}`} className="underline underline-offset-4 hover:text-accent">
        {CONTACT}
      </a>
    </p>
  );
}

export default function SmsPolicyPage() {
  return (
    <article className="border-b border-border py-24 sm:py-32">
      <div className="container-wide max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          SMS policy
        </p>
        <h1 className="mt-4 text-balance text-4xl font-medium tracking-tight sm:text-5xl">
          tech.regardless Front Desk SMS Privacy Policy and Terms
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Front Desk is the text message assistant that replies when you call
          a local business and they can&apos;t pick up. This page covers what
          happens with your information and what you agree to by texting with
          it.
        </p>
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          Last updated {UPDATED}
        </p>
        <nav aria-label="On this page" className="mt-6 flex gap-5 text-sm">
          <a href="#privacy" className="underline underline-offset-4 hover:text-accent">Privacy Policy</a>
          <a href="#terms" className="underline underline-offset-4 hover:text-accent">Terms</a>
        </nav>

        {/* ---------------------------------------------------------------- */}
        <section id="privacy" className="mt-16 scroll-mt-24">
          <h2 className="text-3xl font-medium tracking-tight">Privacy Policy</h2>
          <div className="mt-8 space-y-10 text-base leading-relaxed text-foreground/85">
            <div>
              <h3 className="text-xl font-medium tracking-tight">What we collect</h3>
              <p className="mt-3">When you text with a business that uses Front Desk, we collect:</p>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>your phone number</li>
                <li>your name</li>
                <li>your service address</li>
                <li>the content of your messages</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium tracking-tight">Why we collect it</h3>
              <p className="mt-3">
                To help the business you called schedule your service request.
                Nothing else.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium tracking-tight">Who sees it</h3>
              <p className="mt-3">
                We don&apos;t sell or share your information with third
                parties for marketing.
              </p>
              <p className="mt-3">
                Messages are processed by our service provider (Twilio) to send
                and receive texts, and by an AI assistant that drafts replies.
                The business you contacted sees your request so they can
                schedule it.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium tracking-tight">Opting out</h3>
              <p className="mt-3">
                Reply <strong>STOP</strong> at any time and we&apos;ll stop
                texting you. Reply <strong>HELP</strong> for help.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium tracking-tight">How long we keep it</h3>
              <p className="mt-3">12 months, then deleted.</p>
            </div>
            <div>
              <h3 className="text-xl font-medium tracking-tight">Contact</h3>
              <div className="mt-3"><Contact /></div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        <section id="terms" className="mt-20 scroll-mt-24 border-t border-border pt-16">
          <h2 className="text-3xl font-medium tracking-tight">Terms</h2>
          <div className="mt-8 space-y-10 text-base leading-relaxed text-foreground/85">
            <div>
              <h3 className="text-xl font-medium tracking-tight">What you&apos;re agreeing to</h3>
              <p className="mt-3">
                By replying to a text from a business using Front Desk, you
                agree to receive messages about your service request.
              </p>
              <p className="mt-3">
                Message frequency varies by conversation. Message and data
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
              <div className="mt-3"><Contact /></div>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
