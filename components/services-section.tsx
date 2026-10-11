import { ArrowUpRight, Code2, PhoneMissed, Workflow } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/reveal";

const services = [
  {
    icon: Code2,
    title: "Custom Websites",
    description:
      "Designed for your brand, built to convert, fast on a phone. No templates, no page builders — code you own on day one.",
    price: "From $1,800",
    href: "/services",
  },
  {
    icon: PhoneMissed,
    title: "AI Front Desk",
    description:
      "Missed-call text-back, an AI agent that books the job over SMS, and review requests that send themselves. Every missed call gets answered.",
    price: "$697/mo · cancel anytime",
    href: "/contact",
  },
  {
    icon: Workflow,
    title: "AI Automation",
    description:
      "Intake, follow-ups, invoicing, reporting — the repetitive work wired together so the business keeps moving while you're on a job.",
    price: "Custom quote",
    href: "/contact",
  },
];

export function ServicesSection() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="border-b border-border py-24 sm:py-32"
    >
      <div className="container-wide">
        <Reveal>
          <SectionHeading
            eyebrow="Services"
            title={
              <>
                What I build,
                <br />
                <span className="text-muted-foreground">and who it&apos;s for</span>
              </>
            }
            description="Three service lines, one builder. Most businesses start with one and add the next when the first one pays for itself."
          />
        </Reveal>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.title} delay={i * 0.08}>
                <Link
                  href={service.href}
                  className="group relative flex h-full flex-col rounded border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-layered focus-ring"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded border border-border bg-muted/40 text-accent">
                      <Icon className="size-5" aria-hidden />
                    </div>
                    <ArrowUpRight
                      className="size-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                      aria-hidden
                    />
                  </div>
                  <h3 className="mt-8 text-2xl font-medium tracking-tight">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                  <p className="mt-8 font-mono text-xs uppercase tracking-wider text-foreground">
                    {service.price}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
