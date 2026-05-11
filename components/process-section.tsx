import { Compass, PenTool, Code2, Rocket } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/reveal";

const steps = [
  {
    n: "01",
    icon: Compass,
    title: "Discovery call",
    description:
      "We talk goals, audience, what success actually looks like. No forms, no decks — just a conversation.",
  },
  {
    n: "02",
    icon: PenTool,
    title: "Design",
    description:
      "I create a design that fits your brand, not a template. You see real screens, not mood boards.",
  },
  {
    n: "03",
    icon: Code2,
    title: "Build",
    description:
      "Modern code. Fast, accessible, SEO-ready from day one. You get preview links every step of the way.",
  },
  {
    n: "04",
    icon: Rocket,
    title: "Launch & support",
    description:
      "Site goes live with a training call. I'm still here when something needs to change — because something always does.",
  },
];

export function ProcessSection() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="border-b border-border py-24 sm:py-32"
    >
      <div className="container-wide">
        <Reveal>
          <SectionHeading
            eyebrow="Process"
            title={
              <>
                Four steps
                <br />
                <span className="text-muted-foreground">No surprises</span>
              </>
            }
            description="The same process every time, whether the project is two weeks or two months."
          />
        </Reveal>

        <div className="relative mt-16">
          {/* Desktop connecting line */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-[1.625rem] hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block"
          />
          <ol className="grid gap-10 md:grid-cols-4 md:gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <Reveal as="li" key={step.n} delay={i * 0.08}>
                  <div className="relative flex flex-col">
                    <div className="relative z-10 flex size-12 items-center justify-center rounded border border-border bg-background">
                      <Icon className="size-5 text-accent" aria-hidden />
                    </div>
                    <p className="mt-5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Step {step.n}
                    </p>
                    <h3 className="mt-2 text-xl font-medium tracking-tight text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
