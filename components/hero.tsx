"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-background"
    >

      <div className="container-wide relative w-full pt-24 pb-20 sm:pt-32">
        <div className="flex flex-col items-start gap-8">
          <h1
            id="hero-heading"
            className="text-balance font-sans text-5xl font-medium leading-[1.02] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-[7.5rem]"
          >
            Solutions that <br className="hidden sm:block" />
            work{" "}
            <span className="text-muted-foreground/60">Regardless</span>
          </h1>

          <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
            You have a problem, we fix it. Websites, an AI front desk for the
            calls you miss, and automation for the busywork in between,
            delivered in four simple steps: discovery call, design, build,
            launch and support.
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

        </div>
      </div>
    </section>
  );
}
