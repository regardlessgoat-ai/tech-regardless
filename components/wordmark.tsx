import { cn } from "@/lib/utils";

/**
 * The brand wordmark: "Tech.Regardless" — Geist Mono, period in accent green.
 */
export function Wordmark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
  };
  return (
    <span
      className={cn(
        "font-mono font-medium tracking-tight",
        sizes[size],
        className
      )}
      aria-label="Tech.Regardless"
    >
      Tech<span className="text-accent">.</span>Regardless
    </span>
  );
}
