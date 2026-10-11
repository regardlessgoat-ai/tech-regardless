import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/reveal";
import { Accordion, type AccordionItem } from "@/components/ui/accordion";
import { ProcessSection } from "@/components/process-section";
import { CtaSection } from "@/components/cta-section";

export const metadata: Metadata = {
  title: "Services & Pricing",
  description:
    "Custom websites from $1,800, an AI front desk for $697 a month, and business automation quoted per project. One builder, one flat number before any work starts.",
};

type Service = {
  id: string;
  n: string;
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
    n: "01",
    name: "Custom Websites",
    problem:
      "Your website is embarrassing you, or you don't have one, and the people who Google you can tell.",
    outcome:
      "A site that looks like your business, loads fast on a phone, and turns visitors into calls.",
    price: "From $1,800",
    priceNote: "flat quote per project, agreed before work starts",
    timeline: "1 to 2 weeks",
    includes: [
      "Design made for your brand, not a template",
      "Built to turn visitors into calls and messages",
      "Fast on a phone, where most of your customers are",
      "A contact form that lands in your inbox",
      "Hosting and domain set up for you",
      "You own the code and the domain on day one",
      "30 days of fixes and changes after launch",
    ],
    cta: "Start a website",
    href: "/contact",
  },
  {
    id: "front-desk",
    n: "02",
    name: "AI Front Desk",
    problem:
      "You're on a job, the phone rings, you can't pick up, and the customer calls the next company on the list.",
    outcome:
      "Every missed call gets a text back within seconds, the details get collected, and you confirm the job with one reply.",
    price: "$697 a month",
    priceNote: "month to month, cancel anytime",
    timeline: "Live once your business number is approved for texting",
    includes: [
      "Missed calls get a text back from your business number",
      "The assistant collects name, address, the problem, and a preferred time",
      "You get one text per request and reply Y or N to confirm",
      "The customer is told when you're coming",
      "After the job, the customer gets a review request",
      "A short summary every Monday morning: calls caught, jobs booked, reviews sent",
      "Never quotes prices, never promises arrival times, never diagnoses",
      "Emergencies get routed straight to your phone",
    ],
    cta: "Ask about Front Desk",
    href: "/contact",
  },
  {
    id: "automation",
    n: "03",
    name: "Business Automation",
    problem:
      "The same five tasks eat your evenings: chasing follow ups, sending invoices, copying things between apps.",
    outcome:
      "The repetitive work wired together so it runs while you're on a job.",
    price: "Custom quote",
    priceNote: "scoped on the discovery call, one flat number",
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
  { from: "desk", text: "Hi, this is Cool Air HVAC. Sorry we missed your call. What's going on with your AC? Reply here and we'll get you scheduled." },
  { from: "customer", text: "It's blowing warm air since this morning" },
  { from: "desk", text: "Got it. What's the service address?" },
  { from: "customer", text: "412 Oak St, Kissimmee" },
  { from: "desk", text: "Thanks. When works best, this afternoon or tomorrow morning?" },
  { from: "customer", text: "Tomorrow morning" },
  { from: "desk", text: "Got it, the owner will confirm shortly." },
] as const;

const faqItems: AccordionItem[] = [
  {
    id: "payment",
    question: "How does payment work?",
    answer: (
      <p>
        Websites and automation: half to start, half on launch, invoiced
        through Stripe. Front Desk is billed monthly and you can cancel any
        month.
      </p>
    ),
  },
  {
    id: "fit",
    question: "What if my project doesn't fit one of these?",
    answer: (
      <p>
        Most do. If yours has a wrinkle, like a booking system or a second
        language, we talk it through on the discovery call and I quote one
        flat number.
      </p>
    ),
  },
  {
    id: "own",
    question: "Do I own what you build?",
    answer: (
      <p>
        Yes. The code, the domain, the accounts. If we part ways you keep
        everything and nothing stops working.
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
      <section className="border-b border-border py-24 sm:py-32">
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
              description="Three services, one builder, one flat number agreed before any work starts."
            />
          </Reveal>

          <Reveal delay={0.08}>
            <ol className="mt-12 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {services.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="hover:text-foreground">
                    {s.n} {s.name}
                  </a>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* One block per service: price column left, detail right */}
      {services.map((s) => (
        <section
          key={s.id}
          id={s.id}
          aria-labelledby={`${s.id}-heading`}
          className="scroll-mt-20 border-b border-border py-20 sm:py-24"
        >
          <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-4">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                {s.n}
              </p>
              <h2
                id={`${s.id}-heading`}
                className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl"
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
      <section className="border-b border-border py-24">
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
