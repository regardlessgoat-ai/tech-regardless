import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FREE_AUDIT_HREF = "/contact?type=free-audit";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden bg-background">
      {/* Sized by its content, not the viewport: a full-height hero left a
          screen of blank space above the headline on tall displays. */}
      <div className="container-wide relative w-full pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="flex flex-col items-start gap-6">
          <h1
            id="hero-heading"
            className="max-w-5xl text-balance font-sans text-5xl font-medium leading-[1.02] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-[6.5rem]"
          >
            Your business keeps running{" "}
            <span className="text-muted-foreground/60">while you&apos;re on the job.</span>
          </h1>

          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Solutions that work. Regardless.
          </p>

          <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Websites, an AI front desk, and automation for small businesses,
            anywhere. You talk to the person who builds it.
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Button href={FREE_AUDIT_HREF} size="lg">
              Get a free audit
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button href="#work" variant="outline" size="lg">
              See the work
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
