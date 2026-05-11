import type { Metadata } from "next";
import { Calendar, Clock, Mail } from "lucide-react";
import { Github, Instagram, Linkedin, Twitter } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with Tech.Regardless. One form, one email, one human reply within 24 hours.",
};

const socials = [
  { href: SITE.social.twitter, label: "Twitter / X", Icon: Twitter },
  { href: SITE.social.github, label: "GitHub", Icon: Github },
  { href: SITE.social.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: SITE.social.instagram, label: "Instagram", Icon: Instagram },
];

export default function ContactPage() {
  return (
    <section className="border-b border-border py-24 sm:py-32">
      <div className="container-wide grid gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Contact
          </p>
          <h1 className="mt-4 text-balance text-5xl font-medium tracking-tight sm:text-6xl md:text-7xl">
            Tell me about
            <br />
            <span className="text-muted-foreground">your project</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            The more specific you are, the better the first reply will be.
            Don&apos;t worry about getting it perfect — we&apos;ll figure
            out the rest on a call.
          </p>

          <div className="mt-12 max-w-xl">
            <ContactForm />
          </div>
        </Reveal>

        <Reveal className="lg:col-span-5" delay={0.1}>
          <aside className="flex flex-col gap-6 rounded border border-border bg-card p-7">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Other ways
              </p>
              <h2 className="mt-3 text-2xl font-medium tracking-tight">
                Prefer email or a call?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Both work. The form is fastest because I see budget and
                project type up front.
              </p>
            </div>

            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 text-accent" aria-hidden />
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    Email
                  </p>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="text-foreground hover:text-accent"
                  >
                    {SITE.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Calendar className="mt-0.5 size-4 text-accent" aria-hidden />
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    Discovery call (free, 30 min)
                  </p>
                  <a
                    href={SITE.calendly}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-accent"
                  >
                    Book on Calendly
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 text-accent" aria-hidden />
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    Response time
                  </p>
                  <p className="text-foreground">
                    Within 24 hours, usually faster.
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-2">
              <Button href={SITE.calendly} size="md" className="w-full">
                Book a discovery call
              </Button>
              {/*
                TODO: To embed the Calendly widget directly, add the inline-embed iframe here:
                  <div className="calendly-inline-widget" data-url={SITE.calendly} />
                and load https://assets.calendly.com/assets/external/widget.js once.
              */}
            </div>

            <div className="border-t border-border pt-5">
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Or find me on
              </p>
              <ul className="mt-3 flex items-center gap-2">
                {socials.map(({ href, label, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex size-9 items-center justify-center rounded border border-border text-muted-foreground hover:border-accent/50 hover:text-foreground focus-ring"
                    >
                      <Icon className="size-4" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
