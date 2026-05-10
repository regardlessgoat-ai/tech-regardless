import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { SITE } from "@/lib/utils";

export function CtaSection() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative isolate overflow-hidden border-b border-border"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,hsl(var(--accent)/0.08),transparent_55%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 [background-image:linear-gradient(to_right,hsl(var(--border)/0.4)_1px,transparent_1px)] [background-size:96px_96px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
      />
      <div className="container-wide py-28 text-center sm:py-36">
        <Reveal>
          <h2
            id="cta-heading"
            className="text-balance text-5xl font-medium leading-[1.05] tracking-[-0.04em] sm:text-6xl md:text-7xl"
          >
            Ready to build something <br className="hidden sm:block" />
            <span className="text-accent">that works?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-muted-foreground sm:text-xl">
            Let&apos;s talk about your project. One email is all it takes.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button href="/contact" size="lg">
              Start a project
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button href={`mailto:${SITE.email}`} variant="ghost" size="lg">
              Or email me directly
            </Button>
          </div>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {SITE.email}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
