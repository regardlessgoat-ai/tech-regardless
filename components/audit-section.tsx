import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { FREE_AUDIT_HREF } from "@/components/hero";

export function AuditSection() {
  return (
    <section id="audit" aria-labelledby="audit-heading" className="border-b border-border py-16 sm:py-20">
      <div className="container-wide">
        <Reveal>
          <div className="flex flex-col gap-6 rounded border border-border bg-card p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Free</p>
              <h2 id="audit-heading" className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
                Free business audit.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Tell us how your business runs day to day. We&apos;ll show you what can be automated
                or fixed with the right tech, and what it would cost. No pressure.
              </p>
            </div>
            <Button href={FREE_AUDIT_HREF} size="lg" className="shrink-0">
              Get a free audit
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
