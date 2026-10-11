"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden gradient-mesh texture-grain"
    >
      {/* Subtle grid lines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(to_right,hsl(var(--border)/0.5)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.5)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      <div className="container-wide relative w-full pt-24 pb-20 sm:pt-32">
        <div className="flex flex-col items-start gap-8">
          <h1
            id="hero-heading"
            className="text-balance font-sans text-5xl font-medium leading-[1.02] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-[7.5rem]"
          >
            Solutions that <br className="hidden sm:block" />
            <span className="relative">
              work
              <span className="absolute -bottom-1 left-0 right-0 h-[6px] rounded-full bg-accent/30 blur-sm" />
            </span>{" "}
            <span className="text-muted-foreground/60">Regardless</span>
          </h1>

          <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Websites, an AI front desk that answers the calls you miss, and
            automation for the busywork in between. One builder, no
            hand-offs, no agencies — just systems that ship and keep working.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button href="#work" size="lg">
              See the work
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              Get in touch
              <ArrowUpRight className="size-4" aria-hidden />
            </Button>
          </div>

          <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-border pt-6 font-mono text-xs uppercase tracking-wider text-muted-foreground sm:grid-cols-2 sm:gap-x-12">
            <div>
              <dt className="text-muted-foreground/70">Response</dt>
              <dd className="mt-1 text-foreground">&lt; 24 hours</dd>
            </div>
            <div>
              <dt className="text-muted-foreground/70">Based in</dt>
              <dd className="mt-1 text-foreground">Kissimmee, FL</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
