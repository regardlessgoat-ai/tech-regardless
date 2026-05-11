import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { BinaryTreeVisual } from "@/components/binary-tree-visual";

export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-b border-border py-24 sm:py-32"
    >
      <div className="container-wide">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <BinaryTreeVisual />
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.1}>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              About
            </p>
            <h2
              id="about-heading"
              className="mt-4 text-balance text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl"
            >
              I build the web like
              <br />
              <span className="text-muted-foreground">it&apos;s 2026 — because it is</span>
            </h2>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>
                I&apos;m a self-taught web designer and developer who spent
                years watching small businesses get stuck with bloated themes,
                page builders, and websites that nobody — including their own
                team — could update without breaking. So I started building
                them differently.
              </p>
              <p>
                Today, I work directly with founders and partner with a
                marketing agency that brings me into projects where the
                stakes are real and the timelines are tight. I write every
                line of code. I make every design decision. And when I say
                a site is shipping Friday, it ships Friday.
              </p>
              <p>
                What makes me different isn&apos;t a stack or a process —
                it&apos;s a refusal to ship anything I wouldn&apos;t put my
                name on. The brand is called Regardless for a reason.
              </p>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-4 border-y border-border py-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              <div>
                {/* TODO: Update with real numbers */}
                <dt>Projects shipped</dt>
                <dd className="mt-1 text-2xl font-medium tracking-tight text-foreground">
                  40+
                </dd>
              </div>
              <div>
                <dt>Industries served</dt>
                <dd className="mt-1 text-2xl font-medium tracking-tight text-foreground">
                  12
                </dd>
              </div>
              <div>
                <dt>Avg load time</dt>
                <dd className="mt-1 text-2xl font-medium tracking-tight text-foreground">
                  &lt; 1.2s
                </dd>
              </div>
            </dl>

            <div className="mt-8">
              <Button href="/about" variant="outline" size="md">
                The full story →
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
