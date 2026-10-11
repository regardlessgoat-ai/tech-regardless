import type { ProjectFrontmatter } from "@/lib/projects";
import { cn } from "@/lib/utils";

type Props = {
  frontmatter: Pick<ProjectFrontmatter, "client" | "about" | "problem" | "solved">;
  /** "stack" = one column, "grid" = two columns on wide screens */
  layout?: "stack" | "grid";
  className?: string;
};

/**
 * The four things a prospect actually wants to know about a project,
 * in the order they ask them. Shared by the work grid cards and the
 * top of every case study page so they can never drift apart.
 */
export function ProjectBrief({ frontmatter, layout = "grid", className }: Props) {
  const cells = [
    { label: "Client", value: frontmatter.client },
    { label: "What they do", value: frontmatter.about },
    { label: "The problem", value: frontmatter.problem },
    { label: "What we solved", value: frontmatter.solved },
  ];

  return (
    <dl
      className={cn(
        "grid gap-5",
        layout === "grid" && "sm:grid-cols-2",
        className
      )}
    >
      {cells.map((cell) => (
        <div key={cell.label}>
          <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {cell.label}
          </dt>
          <dd className="mt-1.5 text-sm leading-relaxed text-foreground/90">
            {cell.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
