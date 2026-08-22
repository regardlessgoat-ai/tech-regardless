import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

type Props = {
  projects: Project[];
  variant?: "home" | "index";
};

export function WorkGrid({ projects, variant = "home" }: Props) {
  // Home: featured first, large; rest two-up. Index: even grid.
  const sorted = [...projects].sort(
    (a, b) => (a.frontmatter.order ?? 99) - (b.frontmatter.order ?? 99)
  );

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="border-b border-border py-24 sm:py-32"
    >
      <div className="container-wide">
        <Reveal>
          <SectionHeading
            eyebrow="Selected work"
            title={
              <>
                Real projects
                <br />
                <span className="text-muted-foreground">Real outcomes</span>
              </>
            }
            description="A handful of recent builds. Each one started as a conversation and ended as a site that drives the business forward."
          />
        </Reveal>

        {variant === "home" ? (
          <HomeLayout projects={sorted} />
        ) : (
          <IndexLayout projects={sorted} />
        )}
      </div>
    </section>
  );
}

function HomeLayout({ projects }: { projects: Project[] }) {
  const [feature, ...rest] = projects;
  const secondary = rest.slice(0, 2);

  return (
    <div className="mt-16 space-y-4">
      {feature && (
        <Reveal>
          <ProjectCard project={feature} large />
        </Reveal>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {secondary.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.08}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function IndexLayout({ projects }: { projects: Project[] }) {
  return (
    <div className="mt-16 grid gap-4 md:grid-cols-2">
      {projects.map((project, i) => (
        <Reveal key={project.slug} delay={(i % 2) * 0.08}>
          <ProjectCard project={project} />
        </Reveal>
      ))}
    </div>
  );
}

function ProjectCard({
  project,
  large = false,
}: {
  project: Project;
  large?: boolean;
}) {
  const { frontmatter, slug } = project;
  return (
    <Link
      href={`/work/${slug}`}
      className={cn(
        "group relative block overflow-hidden rounded border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-layered focus-ring",
        large && "md:flex md:items-stretch"
      )}
    >
      <div
        className={cn(
          "relative aspect-[16/10] w-full overflow-hidden bg-muted",
          large && "md:aspect-auto md:w-3/5"
        )}
      >
        <Image
          src={frontmatter.heroImage}
          alt={`${frontmatter.title} — preview`}
          fill
          sizes={large ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          priority={large}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>

      <div className={cn("p-6 sm:p-8", large && "md:flex md:w-2/5 md:flex-col md:justify-between")}>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{frontmatter.industry}</Badge>
            <Badge variant="outline">{frontmatter.year}</Badge>
          </div>
          <h3 className={cn("mt-4 font-medium tracking-tight", large ? "text-3xl sm:text-4xl" : "text-2xl")}>
            {frontmatter.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {frontmatter.tagline}
          </p>
        </div>

        <div className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-accent">
          View case study
          <ArrowUpRight
            className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden
          />
        </div>
      </div>
    </Link>
  );
}
