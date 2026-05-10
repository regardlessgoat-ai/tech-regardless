import { Reveal } from "@/components/reveal";

/*
 * TODO: Replace these grayscale placeholder logos with real partner agency / client logos.
 * Drop SVG/PNG files in /public/images/logos/ and swap the wordmarks below for <Image> tags.
 */
const placeholderLogos = [
  "Northwind",
  "Studio Atlas",
  "Hyperloop & Co.",
  "Crescent Labs",
  "Maverick Group",
];

export function TrustBar() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="border-y border-border bg-muted/20"
    >
      <div className="container-wide py-10">
        <Reveal>
          <p
            id="trust-heading"
            className="text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
          >
            Trusted by agencies and founders across the country
          </p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-16">
            {placeholderLogos.map((logo) => (
              <li
                key={logo}
                className="font-mono text-sm font-medium tracking-tight text-muted-foreground/70 grayscale transition-all duration-300 hover:text-foreground hover:grayscale-0"
              >
                {logo}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
