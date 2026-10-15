import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { ProjectBrief } from "@/components/project-brief";
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
      className="border-b border-border py-16 sm:py-20"
    >
      <div className="container-wide">
        <Reveal>
          <SectionHeading
            eyebrow="Highlighted work"
            title={
              <>
                Real projects
                <br />
                <span className="text-muted-foreground">Real outcomes</span>
              </>
            }
            description="Who the client is, what was broken, and what got fixed. Each one is live."
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
    <div className="mt-10 space-y-4">
      {feature && (
        <Reveal>
          <ProjectCard project={feature} large />
        </Reveal>
      )}
      {secondary.length > 0 && (
        <div className={cn("grid gap-4", secondary.length > 1 && "md:grid-cols-2")}>
          {secondary.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.08}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

function IndexLayout({ projects }: { projects: Project[] }) {
  return (
    <div className="mt-10 grid gap-4 md:grid-cols-2">
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
  const hasImage = Boolean(frontmatter.logo || frontmatter.heroImage);

  return (
    <Link
      href={`/work/${slug}`}
      className={cn(
        "group relative block overflow-hidden rounded border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-layered focus-ring",
        large && hasImage && "md:flex md:items-stretch"
      )}
    >
      {frontmatter.logo ? (
        // Logo cards: the client's mark centred on its brand colour, contained
        // at its own aspect ratio (never cropped). SVG, so sharp at any DPR.
        <div
          className={cn(
            "flex aspect-[16/9] w-full items-center justify-center p-8",
            large && "md:aspect-auto md:w-1/3 md:p-8"
          )}
          style={{ backgroundColor: frontmatter.logoBg }}
        >
          <Image
            src={frontmatter.logo}
            alt={`${frontmatter.client} logo`}
            width={452}
            height={320}
            unoptimized
            className="h-auto max-h-32 w-auto max-w-[70%] object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03] md:max-h-36"
            priority={large}
          />
        </div>
      ) : hasImage && (
        <div
          className={cn(
            "relative aspect-[16/10] w-full overflow-hidden bg-muted",
            large && "md:aspect-auto md:w-3/5"
          )}
        >
          <Image
            src={frontmatter.heroImage!}
            alt={`${frontmatter.title} preview`}
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
      )}

      <div
        className={cn(
          "p-6 sm:p-8",
          large && hasImage && "md:flex md:flex-col md:justify-between",
          large && hasImage && (frontmatter.logo ? "md:w-2/3" : "md:w-2/5")
        )}
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{frontmatter.industry}</Badge>
            <Badge variant="outline">{frontmatter.year}</Badge>
          </div>
          <h3
            className={cn(
              "mt-4 font-medium tracking-tight",
              large ? "text-2xl sm:text-3xl" : "text-2xl"
            )}
          >
            {frontmatter.title}
          </h3>
          <ProjectBrief
            frontmatter={frontmatter}
            layout={large && hasImage && !frontmatter.logo ? "stack" : "grid"}
            className="mt-6 border-t border-border pt-6"
          />
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
