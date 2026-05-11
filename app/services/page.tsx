import type { Metadata } from "next";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/reveal";
import { Accordion, type AccordionItem } from "@/components/ui/accordion";
import { CtaSection } from "@/components/cta-section";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services & Pricing",
  description:
    "Three tiers, transparent pricing, no surprises. Custom websites, redesigns, and ongoing support from Tech.Regardless.",
};

type Tier = {
  id: string;
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: string[];
  timeline: string;
  cta: string;
  highlight?: boolean;
};

const tiers: Tier[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$1,800",
    cadence: "one-time",
    blurb: "For founders who need a real online presence — fast.",
    features: [
      "Up to 5 pages",
      "Mobile-responsive design",
      "Basic SEO setup",
      "Contact form",
      "Vercel hosting (1st year)",
      "30 days of post-launch support",
    ],
    timeline: "2 weeks",
    cta: "Start with Starter",
  },
  {
    id: "professional",
    name: "Professional",
    price: "$3,500",
    cadence: "one-time",
    blurb: "For growing businesses ready to invest in a serious website.",
    features: [
      "Up to 10 pages",
      "Custom design (no templates)",
      "CMS integration (Sanity / Notion)",
      "Advanced SEO + structured data",
      "Analytics & event tracking",
      "Performance budget < 200kb",
      "60 days of post-launch support",
    ],
    timeline: "3–4 weeks",
    cta: "Start Professional",
    highlight: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "$6,000+",
    cadence: "starting",
    blurb: "For founders who need the site to actually drive revenue.",
    features: [
      "Unlimited pages",
      "Custom features & integrations",
      "E-commerce or booking system",
      "Full brand strategy session",
      "Custom CMS architecture",
      "A/B testing setup",
      "90 days of post-launch support",
    ],
    timeline: "6–8 weeks",
    cta: "Talk about Premium",
  },
];

const alwaysIncluded = [
  "Mobile-responsive design",
  "SEO foundations",
  "Accessibility (WCAG AA)",
  "Fast hosting setup",
  "Privacy-friendly analytics",
  "Training call before launch",
  "30 days post-launch support",
  "Source code, fully owned by you",
];

const faqItems: AccordionItem[] = [
  {
    id: "what-if-over",
    question: "What if my project doesn't fit a tier?",
    answer: (
      <p>
        These are starting points, not boxes. Most projects land in one
        of the three, but if yours has a wrinkle — booking system, custom
        integration, multilingual — we&apos;ll talk through it on the
        discovery call and quote a flat fee.
      </p>
    ),
  },
  {
    id: "deposit",
    question: "How does payment work?",
    answer: (
      <p>
        50% to start, 50% on launch. For Premium projects we can split into
        three milestone payments. Invoices via Stripe — no contracts to
        sign in blood.
      </p>
    ),
  },
  {
    id: "stack",
    question: "What stack do you use?",
    answer: (
      <p>
        Next.js, Tailwind, TypeScript, deployed on Vercel. For content I
        usually reach for Sanity or Notion. For e-commerce, Shopify or
        custom. Whatever I pick, you own all of it on day one.
      </p>
    ),
  },
  {
    id: "rush",
    question: "Can you do a rush job?",
    answer: (
      <p>
        Sometimes. If the timeline is tight there&apos;s a 25% rush fee
        and we cut scope, not corners. I&apos;d rather ship a smaller site
        on time than a bigger site late.
      </p>
    ),
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-border py-24 sm:py-32">
        <div className="container-wide">
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Services & pricing"
              title={
                <>
                  Three tiers
                  <br />
                  <span className="text-muted-foreground">
                    No hidden fees
                  </span>
                </>
              }
              description="One transparent number per project. The number on the proposal is the number you pay."
            />
          </Reveal>

          <div className="mt-16 grid gap-4 lg:grid-cols-3">
            {tiers.map((tier, i) => (
              <Reveal key={tier.id} delay={i * 0.08}>
                <div
                  id={tier.id}
                  className={cn(
                    "relative flex h-full flex-col rounded border bg-card p-7 transition-all",
                    tier.highlight
                      ? "border-accent/60 shadow-glow"
                      : "border-border hover:border-foreground/30"
                  )}
                >
                  {tier.highlight && (
                    <Badge variant="accent" className="absolute -top-3 left-7">
                      <Sparkles className="size-3" aria-hidden />
                      Most popular
                    </Badge>
                  )}

                  <h3 className="text-2xl font-medium tracking-tight">
                    {tier.name}
                  </h3>
                  <p className="mt-2 min-h-[3rem] text-sm text-muted-foreground">
                    {tier.blurb}
                  </p>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-5xl font-medium tracking-tight">
                      {tier.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {tier.cadence}
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Timeline · {tier.timeline}
                  </p>

                  <ul className="mt-8 flex-1 space-y-3">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-accent"
                          aria-hidden
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <Button
                      href="/contact"
                      variant={tier.highlight ? "primary" : "outline"}
                      size="md"
                      className="w-full"
                    >
                      {tier.cta}
                    </Button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Always included */}
      <section className="border-b border-border py-24">
        <div className="container-wide">
          <Reveal>
            <SectionHeading
              eyebrow="Standard kit"
              title={
                <>
                  What&apos;s always
                  <br />
                  <span className="text-muted-foreground">included</span>
                </>
              }
              description="No matter which tier you pick, every project ships with these. They aren't add-ons."
            />
          </Reveal>
          <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {alwaysIncluded.map((item, i) => (
              <Reveal key={item} delay={(i % 4) * 0.05}>
                <li className="flex items-start gap-3 rounded border border-border bg-card p-4 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                  <span>{item}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Pricing FAQ */}
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
