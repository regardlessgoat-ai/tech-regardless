import Link from "next/link";

type Section = {
  heading: string;
  body: React.ReactNode;
};

type Props = {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: Section[];
  related: { href: string; label: string };
};

export function LegalPage({ eyebrow, title, intro, updated, sections, related }: Props) {
  return (
    <article className="border-b border-border py-24 sm:py-32">
      <div className="container-wide max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-balance text-4xl font-medium tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">{intro}</p>
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          Last updated {updated}
        </p>

        <div className="mt-14 space-y-12">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-xl font-medium tracking-tight">{s.heading}</h2>
              <div className="mt-3 space-y-3 text-base leading-relaxed text-foreground/85">
                {s.body}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-16 border-t border-border pt-6 text-sm text-muted-foreground">
          See also:{" "}
          <Link href={related.href} className="text-foreground underline underline-offset-4 hover:text-accent">
            {related.label}
          </Link>
        </p>
      </div>
    </article>
  );
}
