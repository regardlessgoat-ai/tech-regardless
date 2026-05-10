import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type Variant = "default" | "accent" | "outline";

const variants: Record<Variant, string> = {
  default: "bg-muted text-muted-foreground",
  accent: "bg-accent/15 text-accent border border-accent/30",
  outline: "border border-border text-muted-foreground",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
