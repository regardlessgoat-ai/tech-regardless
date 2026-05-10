import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/reveal";
import { CtaSection } from "@/components/cta-section";

export const metadata: Metadata = {
  title: "About",
  description:
    "Tech.Regardless is the studio of a single web designer and developer. Here's the story.",
};

const principles = [
  {
    title: "Ship beats perfect.",
    body: "A live site you can iterate on outperforms a perfect one stuck in design review. Always.",
  },
  {
    title: "Own the whole stack.",
    body: "Design, code, deploy, support. One person, one mind, one deadline. Hand-offs are where projects die.",
  },
  {
    title: "Performance is a feature.",
    body: "If your site takes three seconds to load, you've lost half your visitors before they read a word.",
  },
  {
    title: "Templates are the enemy.",
    body: "Your business is specific. Your site should be too. No theme is going to convert better than something built for you.",
  },
];

const stack = [
  "Next.js",
  "TypeScript",
  "React",
  "Tailwind CSS",
  "Framer Motion",
  "Sanity CMS",
  "Shopify",
  "Stripe",
  "Vercel",
  "Resend",
  "Figma",
  "Linear",
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-border py-24 sm:py-32">
        <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            {/* TODO: Replace with my real headshot — drop a square image into /public/images/headshot.jpg */}
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded border border-border">
              <Image
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=900&q=80"
                alt="Tech.Regardless founder portrait"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.1}>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              About
            </p>
            <h1 className="mt-4 text-balance text-5xl font-medium tracking-tight sm:text-6xl md:text-7xl">
              One designer.
              <br />
              <span className="text-muted-foreground">One developer.</span>
              <br />
              Same person.
            </h1>
            <p className="mt-6 max-w-2xl text-xl text-muted-foreground">
              I run Tech.Regardless solo — by choice. Here&apos;s why that
              matters for the work you&apos;ll get.
            </p>
          </Reveal>
        </div>
      </section>

      {/* My story */}
      <section className="border-b border-border py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <SectionHeading eyebrow="My story" title={<>How I got here.</>} />
          </Reveal>
          <Reveal className="lg:col-span-8 space-y-6 text-lg leading-relaxed text-muted-foreground" delay={0.1}>
            <p>
              I didn&apos;t go the traditional route. I taught myself to code
              in my late twenties after years of watching small businesses
              I cared about — restaurants, gyms, friends&apos; brands —
              get bled dry by agencies that delivered mediocre WordPress
              sites and disappeared.
            </p>
            <p>
              I started taking on small projects on the side, then bigger
              ones, then a marketing agency partner brought me in to clean
              up a project a previous developer had walked away from. I
              shipped it on time. They sent me three more. That was four
              years ago, and I haven&apos;t looked back.
            </p>
            <p>
              Today I split my time between direct clients (founders,
              small businesses) and agency partners who white-label my
              work. Every project gets the same treatment: I write all the
              code, I make all the design calls, and I&apos;m the one you
              email when something needs to change.
            </p>
            <p>
              The brand is called Regardless because that&apos;s the
              promise. Tight deadline? Regardless. Your last developer
              ghosted? Regardless. Built on Squarespace and need to
              migrate? Regardless. The work ships.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Principles */}
      <section className="border-b border-border py-24">
        <div className="container-wide">
          <Reveal>
            <SectionHeading
              eyebrow="What I believe"
              title={
                <>
                  Four rules
                  <br />
                  <span className="text-muted-foreground">I work by.</span>
                </>
              }
            />
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 0.08}>
                <div className="rounded border border-border bg-card p-7">
                  <Check className="size-5 text-accent" aria-hidden />
                  <h3 className="mt-4 text-2xl font-medium tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="border-b border-border py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <SectionHeading
              eyebrow="Tools"
              title={<>What I build with.</>}
              description="The stack changes when something better comes along. These are today's defaults."
            />
          </Reveal>
          <Reveal className="lg:col-span-8" delay={0.1}>
            <ul className="flex flex-wrap gap-2">
              {stack.map((s) => (
                <li key={s}>
                  <Badge variant="outline" className="text-sm">
                    {s}
                  </Badge>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Beyond the work */}
      <section className="border-b border-border py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <SectionHeading
              eyebrow="Off the clock"
              title={<>Beyond the work.</>}
            />
          </Reveal>
          <Reveal
            className="lg:col-span-8 space-y-5 text-lg leading-relaxed text-muted-foreground"
            delay={0.1}
          >
            {/* TODO: Personalize this section with real details */}
            <p>
              Based remote-first, mostly working from a small home studio
              with too many monitors and one very loud cat. I drink more
              espresso than I should, run twice a week, and read more
              fiction than tech books — I think that makes me a better
              designer, not a worse engineer.
            </p>
            <p>
              When I&apos;m not building, I&apos;m usually tinkering with
              side projects, helping friends launch things, or playing
              chess badly. Find me on{" "}
              <a
                href="https://twitter.com/techregardless"
                className="text-accent underline-offset-4 hover:underline"
              >
                X
              </a>{" "}
              if you want to say hi.
            </p>
          </Reveal>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
