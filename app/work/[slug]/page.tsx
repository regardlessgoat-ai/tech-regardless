import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import {
  getAdjacentProjects,
  getAllProjects,
  getProjectBySlug,
} from "@/lib/projects";
import { cn } from "@/lib/utils";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return {};
  const { title, tagline, heroImage } = project.frontmatter;
  return {
    title,
    description: tagline,
    openGraph: {
      title,
      description: tagline,
      images: [{ url: heroImage }],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const { frontmatter, content } = project;
  const { next } = await getAdjacentProjects(params.slug);

  return (
    <article className="pb-24">
      <div className="container-wide pt-10">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground focus-ring"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to work
        </Link>
      </div>

      {/* Hero */}
      <header className="container-wide mt-8">
        <Reveal>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent">{frontmatter.industry}</Badge>
            <Badge variant="outline">{frontmatter.year}</Badge>
            <Badge variant="outline">{frontmatter.timeline}</Badge>
          </div>
          <h1 className="mt-6 text-balance text-5xl font-medium tracking-tight sm:text-6xl md:text-7xl">
            {frontmatter.title}
          </h1>
          <p className="mt-5 max-w-2xl text-xl text-muted-foreground">
            {frontmatter.tagline}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded border border-border bg-muted">
            <Image
              src={frontmatter.heroImage}
              alt={`${frontmatter.title} — hero image`}
              fill
              priority
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </header>

      {/* Two-column meta */}
      <section className="container-wide mt-20 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-8 space-y-12">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              The challenge
            </p>
            <p className="mt-4 text-lg leading-relaxed text-foreground">
              {frontmatter.challenge}
            </p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              The solution
            </p>
            <p className="mt-4 text-lg leading-relaxed text-foreground">
              {frontmatter.solution}
            </p>
          </div>
          {content?.trim() && (
            <div className="prose prose-invert max-w-none text-muted-foreground prose-p:text-base prose-p:leading-relaxed prose-strong:text-foreground">
              <MDXRemote source={content} />
            </div>
          )}
        </Reveal>

        <Reveal className="lg:col-span-4" delay={0.1}>
          <aside className="sticky top-24 rounded border border-border bg-card p-6">
            <dl className="space-y-5 text-sm">
              <Meta label="Client" value={frontmatter.client} />
              <Meta label="Role" value={frontmatter.role} />
              <Meta label="Year" value={frontmatter.year} />
              <Meta label="Timeline" value={frontmatter.timeline} />
              <div>
                <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Tech stack
                </dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {frontmatter.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </dd>
              </div>
            </dl>

            {frontmatter.liveUrl && (
              <div className="mt-6 border-t border-border pt-6">
                <Button href={frontmatter.liveUrl} size="md" className="w-full">
                  Visit live site
                  <ArrowUpRight className="size-4" aria-hidden />
                </Button>
              </div>
            )}
          </aside>
        </Reveal>
      </section>

      {/* Gallery */}
      {frontmatter.gallery && frontmatter.gallery.length > 0 && (
        <section className="container-wide mt-24 space-y-4">
          {chunkGallery(frontmatter.gallery).map((row, i) => (
            <Reveal key={i}>
              {row.length === 1 ? (
                <GalleryImage item={row[0]} aspect="wide" />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {row.map((item, j) => (
                    <GalleryImage key={j} item={item} aspect="split" />
                  ))}
                </div>
              )}
            </Reveal>
          ))}
        </section>
      )}

      {/* Results */}
      <section className="container-wide mt-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Results
          </p>
          <h2 className="mt-3 text-balance text-4xl font-medium tracking-tight sm:text-5xl">
            What changed after launch.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {frontmatter.results.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.06}>
              <div className="rounded border border-border bg-card p-6">
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-3 text-4xl font-medium tracking-tight text-foreground">
                  {stat.value}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Next project */}
      {next && (
        <section className="container-wide mt-24">
          <Link
            href={`/work/${next.slug}`}
            className="group flex flex-col items-start justify-between gap-4 rounded border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-layered focus-ring sm:flex-row sm:items-center"
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Next project
              </p>
              <p className="mt-2 text-3xl font-medium tracking-tight">
                {next.frontmatter.title}
              </p>
            </div>
            <ArrowRight
              className="size-6 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent"
              aria-hidden
            />
          </Link>
        </section>
      )}
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-foreground">{value}</dd>
    </div>
  );
}

function GalleryImage({
  item,
  aspect,
}: {
  item: { src: string; caption?: string; aspect?: "wide" | "split" };
  aspect: "wide" | "split";
}) {
  return (
    <figure>
      <div
        className={cn(
          "relative w-full overflow-hidden rounded border border-border bg-muted",
          aspect === "wide" ? "aspect-[16/9]" : "aspect-[4/3]"
        )}
      >
        <Image
          src={item.src}
          alt={item.caption || "Project gallery image"}
          fill
          sizes={aspect === "wide" ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
          loading="lazy"
          className="object-cover"
        />
      </div>
      {item.caption && (
        <figcaption className="mt-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {item.caption}
        </figcaption>
      )}
    </figure>
  );
}

/** Group gallery items so wide items take a full row, split items pair into two-column rows. */
function chunkGallery<T extends { aspect?: "wide" | "split" }>(items: T[]) {
  const rows: T[][] = [];
  let buffer: T[] = [];
  for (const item of items) {
    if (item.aspect === "wide") {
      if (buffer.length) {
        rows.push(buffer);
        buffer = [];
      }
      rows.push([item]);
    } else {
      buffer.push(item);
      if (buffer.length === 2) {
        rows.push(buffer);
        buffer = [];
      }
    }
  }
  if (buffer.length) rows.push(buffer);
  return rows;
}
