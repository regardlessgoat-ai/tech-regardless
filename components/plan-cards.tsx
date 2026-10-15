import { ArrowRight, ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { GUARANTEE, PLAN, SIDE_SERVICES } from "@/lib/offer";

/**
 * The Full Presence Plan as the featured card, the guarantee right under its
 * list, and the two project services as smaller cards beside it. Used on the
 * homepage and on Services.
 */
export function PlanCards({
  planHref = "/services#front-desk",
  headingLevel = "h3",
}: {
  planHref?: string;
  /** h3 under a section h2 (homepage); h2 directly under the page h1 (Services). */
  headingLevel?: "h2" | "h3";
}) {
  const H = headingLevel;
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Reveal className="lg:col-span-2">
        <article className="flex h-full flex-col rounded border border-accent/40 bg-card p-6 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">The monthly plan</p>
          <H className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">{PLAN.title}</H>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {PLAN.includes.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-base">
                <Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-start gap-3 rounded border border-border bg-muted/40 p-4">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
            <p className="text-sm leading-relaxed text-foreground">
              <span className="font-medium">Our guarantee. </span>
              {GUARANTEE}
            </p>
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
            <Button href="/contact?type=ai-front-desk" size="md">
              Start the plan
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button href={planHref} variant="ghost" size="md">
              How it works
            </Button>
          </div>
        </article>
      </Reveal>

      <div className="grid gap-4">
        {SIDE_SERVICES.map((s, i) => (
          <Reveal key={s.title} delay={0.06 * (i + 1)}>
            <Link
              href={s.href}
              className="group flex h-full flex-col rounded border border-border bg-card p-6 transition-colors hover:bg-muted/30 focus-ring"
            >
              <div className="flex items-start justify-between gap-4">
                <H className="text-xl font-medium tracking-tight">{s.title}</H>
                <ArrowUpRight
                  className="size-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                  aria-hidden
                />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              <p className="mt-auto pt-4 font-mono text-xs uppercase tracking-wider text-foreground">{s.price}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
