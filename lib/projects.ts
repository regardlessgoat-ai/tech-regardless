import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type ProjectFrontmatter = {
  title: string;
  client: string;
  industry: string;
  year: string;
  timeline: string;
  role: string;
  liveUrl?: string;
  heroImage: string;
  tags: string[];
  featured?: boolean;
  order?: number;
  challenge: string;
  solution: string;
  results: { label: string; value: string }[];
  gallery?: { src: string; caption?: string; aspect?: "wide" | "split" }[];
  tagline: string;
};

export type Project = {
  slug: string;
  frontmatter: ProjectFrontmatter;
  content: string;
};

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

export async function getAllProjects(): Promise<Project[]> {
  const files = await fs.readdir(PROJECTS_DIR);
  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));
  const projects = await Promise.all(
    mdxFiles.map(async (file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = await fs.readFile(path.join(PROJECTS_DIR, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug,
        frontmatter: data as ProjectFrontmatter,
        content,
      } satisfies Project;
    })
  );
  return projects.sort(
    (a, b) => (a.frontmatter.order ?? 99) - (b.frontmatter.order ?? 99)
  );
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const raw = await fs.readFile(
      path.join(PROJECTS_DIR, `${slug}.mdx`),
      "utf8"
    );
    const { data, content } = matter(raw);
    return {
      slug,
      frontmatter: data as ProjectFrontmatter,
      content,
    };
  } catch {
    return null;
  }
}

export async function getAdjacentProjects(slug: string): Promise<{
  prev: Project | null;
  next: Project | null;
}> {
  const all = await getAllProjects();
  const idx = all.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}
