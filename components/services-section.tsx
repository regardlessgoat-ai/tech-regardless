import { ArrowUpRight, Code2, PhoneMissed, Workflow } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/reveal";

const services = [
  {
    icon: Code2,
    title: "Custom Websites",
    description:
      "Designed for your brand, built to turn visitors into calls, fast on a phone. You own the code on day one.",
    price: "From $1,800",
    href: "/services#websites",
  },
  {
    icon: PhoneMissed,
    title: "AI Front Desk",
    description:
      "Texts back every call you miss, books the job over SMS, and asks happy customers for a review.",
    price: "$499/mo, cancel anytime",
    href: "/services#front-desk",
  },
  {
    icon: Workflow,
    title: "Business Automation",
    description:
      "Intake, follow ups, invoicing and reporting wired together so the business keeps moving while you are on a job.",
    price: "Custom quote",
    href: "/services#automation",
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

        <Reveal delay={0.08}>
          <ul className="mt-16 divide-y divide-border rounded border border-border bg-card">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <li key={service.title}>
                  <Link
                    href={service.href}
                    className="group flex flex-col gap-4 p-6 transition-colors hover:bg-muted/30 focus-ring sm:flex-row sm:items-center sm:gap-6 sm:p-7"
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded border border-border bg-muted/40 text-accent">
                      <Icon className="size-5" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-medium tracking-tight">
                        {service.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <p className="font-mono text-xs uppercase tracking-wider text-foreground">
                        {service.price}
                      </p>
                      <ArrowUpRight
                        className="size-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                        aria-hidden
                      />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
