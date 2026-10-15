import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/reveal";
import { PlanCards } from "@/components/plan-cards";

export function ServicesSection() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="border-b border-border py-16 sm:py-20"
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
            description="One monthly plan that keeps the phone and the website working for you, plus one time builds when you need them."
          />
        </Reveal>

        <div className="mt-10">
          <PlanCards />
        </div>
      </div>
    </section>
  );
}
