import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Tag = "h2",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
      )}
      <Tag className="text-balance text-4xl font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl">
        {title}
      </Tag>
      {description && (
        <p className="mt-5 text-balance text-lg text-muted-foreground sm:text-xl">
          {description}
        </p>
      )}
    </div>
  );
}
