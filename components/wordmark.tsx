import { cn } from "@/lib/utils";

/**
 * The brand wordmark: "Tech.Regardless" — Geist Mono, period in accent green.
 * Optional `suffix` renders an extra accent-period segment (e.g. ".Home").
 */
export function Wordmark({
  className,
  size = "md",
  suffix,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  suffix?: string;
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
      aria-label={suffix ? `Tech.Regardless.${suffix}` : "Tech.Regardless"}
    >
      Tech<span className="text-accent">.</span>Regardless
      {suffix ? (
        <>
          <span className="text-accent">.</span>
          {suffix}
        </>
      ) : null}
    </span>
  );
}
