import type { Metadata } from "next";
import { openGraphFor } from "@/lib/seo";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/reveal";
import { Accordion, type AccordionItem } from "@/components/ui/accordion";
import { ProcessSection } from "@/components/process-section";
import { PlanCards } from "@/components/plan-cards";
import { CtaSection } from "@/components/cta-section";

export const metadata: Metadata = {
  title: "Services & Pricing",
  description:
    "Full Presence Plan, $500 a month: missed call text back, booking over text, review requests, website care. Websites from $1,800. Automation quoted.",
  alternates: { canonical: "/services" },
  openGraph: openGraphFor("/services"),
};

type Service = {
  id: string;
  name: string;
  problem: string;
  outcome: string;
  price: string;
  priceNote: string;
  timeline: string;
  includes: string[];
  cta: string;
  href: string;
};

const services: Service[] = [
  {
    id: "websites",
    name: "Custom Websites",
    problem:
      "Your website is embarrassing you, or you don't have one, and the people who Google you can tell.",
    outcome:
      "A site that looks like your business, loads fast on a phone, and turns visitors into calls.",
    price: "From $1,800",
    priceNote: "one time flat number, agreed before work starts",
    timeline: "1 to 2 weeks",
    includes: [
      "Design made for your brand, not a template",
      "Built to turn visitors into calls and messages",
      "Fast on a phone, where most of your customers are",
      "A contact form that lands in your inbox",
      "Hosting and domain set up for you",
      "You own the code and the domain on day one",
      "30 days of fixes and changes after launch, then covered by the $500 monthly plan if you want it",
    ],
    cta: "Start a website",
    href: "/contact",
  },
  {
    id: "front-desk",
    name: "Full Presence Plan",
    problem:
      "You're on a job, the phone rings, you can't pick up, and the customer calls the next company on the list.",
    outcome:
      "Every missed call gets a text back within seconds, the details get collected, you confirm the job with one reply, and happy customers get asked for reviews and referrals.",
    price: "$500 a month",
    priceNote: "one plan: the Front Desk plus ongoing website updates and support, cancel anytime",
    timeline: "Live once your business number is approved for texting",
    includes: [
      "Missed calls get a text back from your business number",
      "The assistant collects the customer's name, what they need, and a good time",
      "You get one text per request and reply Y or N to confirm",
      "The customer is told when you're coming",
      "After the job, the customer gets a follow up asking for a review",
      "You can add your own line to that follow up, like a referral offer for their friends or a credit on their next visit",
      "Never quotes prices, never promises arrival times, never diagnoses",
      "Ongoing website updates, fixes, and support included in the same plan",
    ],
    cta: "Start the plan",
    href: "/contact?type=ai-front-desk",
  },
  {
    id: "automation",
    name: "Business Automation",
    problem:
      "If you're doing the same thing by hand every week, that's a job for software, not for you. Intake, follow-ups, invoicing, reporting, dashboards, scheduling, the handoffs between your people.",
    outcome:
      "Wired together so the business keeps moving while you're on a job. Don't see your problem listed? Describe it in the form. We'll tell you straight whether we can solve it, and what it'd cost.",
    price: "Custom quote",
    priceNote: "one time flat number, scoped on the discovery call",
    timeline: "Depends on scope, agreed in writing up front",
    includes: [
      "Intake forms that text you the moment they're submitted",
      "Follow ups that send themselves on a schedule you set",
      "Invoices and payment reminders that go out without you",
      "A weekly report of what happened, in plain English",
      "Built on tools you already pay for where possible",
    ],
    cta: "Describe the busywork",
    href: "/contact",
  },
];

// A sample Front Desk thread. Illustrative, not a real customer.
const sampleThread = [
  { from: "desk", text: "Hi, this is Cool Air HVAC. Sorry we missed your call. Who are we speaking with?" },
  { from: "customer", text: "Maria" },
  { from: "desk", text: "Thanks Maria. What do you need help with?" },
  { from: "customer", text: "The AC is blowing warm air since this morning" },
  { from: "desk", text: "Got it. When is a good time for us to come by?" },
  { from: "customer", text: "Tomorrow morning" },
  { from: "desk", text: "Thanks, we have your details and Cool Air HVAC will text you shortly." },
] as const;

const faqItems: AccordionItem[] = [
  {
    id: "payment",
    question: "How does payment work?",
    answer: (
      <p>
        Websites and automation: half to start, half on launch, invoiced
        through Stripe. The monthly plan is $500 and covers the AI Front
        Desk plus ongoing website updates and support. Cancel any month.
      </p>
    ),
  },
  {
    id: "website-prep",
    question: "What do I need to have ready for a website?",
    answer: (
      <div className="space-y-3">
        <p>
          Not much. Come to the discovery call with rough answers to these
          and we can quote on the spot:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            What is the site for? Getting calls, booking appointments, or
            showing off your work.
          </li>
          <li>
            What should a visitor be able to do? Call you, fill out a form,
            book a time, see a gallery or a menu, read reviews.
          </li>
          <li>
            Any logo, colors, photos of real work, and the words you already
            use to describe your business. Rough is fine.
          </li>
        </ul>
        <p>
          That covers the websites we build: a handful of pages, a contact
          form, a booking link, galleries, menus, reviews, and the business
          basics. Bigger software, like customer accounts, staff logins, or a
          full online store, is a separate project with its own quote, and
          we&apos;ll tell you up front if what you describe is heading there.
        </p>
      </div>
    ),
  },
  {
    id: "fit",
    question: "What if my problem doesn't fit one of these?",
    answer: (
      <p>
        Tell us anyway. We would love to know what&apos;s slowing your
        business down. If we can fix it we&apos;ll say so and give you a one
        time flat number. If we can&apos;t, we&apos;ll tell you that too.
      </p>
    ),
  },
  {
    id: "own",
    question: "Do I own what you build?",
    answer: (
      <p>
        The website is yours: the code, the domain, the accounts. If we part
        ways it keeps working without me. The Front Desk and ongoing support
        are a monthly service, so they run as long as you&apos;re on the
        plan, and your customer list and job history stay yours either way.
      </p>
    ),
  },
  {
    id: "rush",
    question: "Can you do a rush job?",
    answer: (
      <p>
        Sometimes. A tight deadline adds 25% and we cut scope, not corners.
        A smaller site on time beats a bigger site late.
      </p>
    ),
  },
  {
    id: "front-desk-setup",
    question: "What do I need for Front Desk?",
    answer: (
      <p>
        A business phone line and about ten minutes. I set up the texting
        number, you turn on call forwarding for calls you don&apos;t answer,
        and we test it together before it goes live.
      </p>
    ),
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Header */}
      <section className="border-b border-border pt-16 pb-12 sm:pt-20 sm:pb-14">
        <div className="container-wide">
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Services and pricing"
              title={
                <>
                  You have a problem.
                  <br />
                  <span className="text-muted-foreground">Pick the fix.</span>
                </>
              }
              description="One monthly plan, plus one time builds. Websites and automation are a flat number agreed before any work starts."
            />
          </Reveal>

        </div>
      </section>

      <section aria-label="Plans" className="border-b border-border py-12 sm:py-16">
        <div className="container-wide">
          <PlanCards headingLevel="h2" />
        </div>
      </section>

      {/* One block per service: price column left, detail right */}
      {services.map((s) => (
        <section
          key={s.id}
          id={s.id}
          aria-labelledby={`${s.id}-heading`}
          className="scroll-mt-20 border-b border-border py-16 sm:py-20"
        >
          <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-4">
              <h2
                id={`${s.id}-heading`}
                className="text-3xl font-medium tracking-tight sm:text-4xl"
              >
                {s.name}
              </h2>
              <p className="mt-8 text-4xl font-medium tracking-tight sm:text-5xl">
                {s.price}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{s.priceNote}</p>
              <dl className="mt-6 border-t border-border pt-4 text-sm">
                <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Timeline
                </dt>
                <dd className="mt-1 text-foreground">{s.timeline}</dd>
              </dl>
              <div className="mt-8">
                <Button href={s.href} size="md">
                  {s.cta}
                </Button>
              </div>
            </Reveal>

            <Reveal className="lg:col-span-8" delay={0.08}>
              <p className="text-xl leading-snug text-foreground sm:text-2xl">
                {s.problem}
              </p>
              <p className="mt-4 text-lg text-muted-foreground">{s.outcome}</p>

              <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                {s.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {s.id === "front-desk" && (
                <figure className="mt-12 max-w-md">
                  <figcaption className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    What a customer sees, sample thread
                  </figcaption>
                  <ol className="space-y-2 rounded border border-border bg-card p-4">
                    {sampleThread.map((m, i) => (
                      <li
                        key={i}
                        className={
                          m.from === "desk"
                            ? "mr-10 w-fit rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2 text-sm"
                            : "ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-sm bg-accent px-3.5 py-2 text-sm text-accent-foreground"
                        }
                      >
                        {m.text}
                      </li>
                    ))}
                  </ol>
                </figure>
              )}
            </Reveal>
          </div>
        </section>
      ))}

      <ProcessSection />

      {/* FAQ */}
      <section className="border-b border-border py-16 sm:py-20">
        <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <SectionHeading
              eyebrow="FAQ"
              title={
                <>
                  Pricing
                  <br />
                  questions
                </>
              }
            />
          </Reveal>
          <Reveal className="lg:col-span-8" delay={0.1}>
            <Accordion items={faqItems} />
          </Reveal>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
