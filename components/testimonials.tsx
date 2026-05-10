import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/reveal";
import testimonials from "@/content/testimonials.json";

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="border-b border-border py-24 sm:py-32"
    >
      <div className="container-wide">
        <Reveal>
          <SectionHeading
            eyebrow="Testimonials"
            title={
              <>
                What clients
                <br />
                <span className="text-muted-foreground">actually say.</span>
              </>
            }
          />
        </Reveal>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08}>
              {/* TODO: Replace with real client testimonials — edit /content/testimonials.json */}
              <figure className="flex h-full flex-col rounded border border-border bg-card p-7 transition-colors hover:border-accent/30">
                <Quote className="size-5 text-accent" aria-hidden />
                <blockquote className="mt-5 flex-1 text-base leading-relaxed text-foreground">
                  <p>&ldquo;{t.quote}&rdquo;</p>
                </blockquote>
                <figcaption className="mt-6 border-t border-border pt-4">
                  <div className="flex items-center gap-3">
                    <div
                      aria-hidden
                      className="flex size-9 items-center justify-center rounded-full bg-muted font-mono text-xs uppercase text-muted-foreground"
                    >
                      {t.name
                        .split(" ")
                        .map((s) => s[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
