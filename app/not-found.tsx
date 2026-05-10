import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-wide flex min-h-[70vh] flex-col items-start justify-center py-24">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
        404
      </p>
      <h1 className="mt-4 text-balance text-5xl font-medium tracking-tight sm:text-7xl">
        Page not found.
      </h1>
      <p className="mt-5 max-w-lg text-lg text-muted-foreground">
        Either it moved, never existed, or I broke something. The fix is
        the same in all three cases — head back home.
      </p>
      <div className="mt-8 flex gap-3">
        <Button href="/">Back home</Button>
        <Button href="/work" variant="outline">
          See the work
        </Button>
      </div>
    </section>
  );
}
