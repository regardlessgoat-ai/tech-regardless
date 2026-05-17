import Link from "next/link";
import { Github, Instagram, Linkedin, Twitter } from "lucide-react";
import { Wordmark } from "@/components/wordmark";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/utils";

const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
  { href: "/#faq", label: "FAQ" },
];

const socials = [
  { href: SITE.social.twitter, label: "Twitter / X", Icon: Twitter },
  { href: SITE.social.github, label: "GitHub", Icon: Github },
  { href: SITE.social.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: SITE.social.instagram, label: "Instagram", Icon: Instagram },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-wide py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Wordmark size="lg" />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              {SITE.tagline} Built different. Delivered regardless.
            </p>
            <ul className="mt-6 flex items-center gap-3">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex size-9 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground focus-ring"
                  >
                    <Icon className="size-4" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Site
            </h3>
            <ul className="space-y-3 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-foreground/80 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Get in touch
            </h3>
            <a
              href={`mailto:${SITE.email}`}
              className="text-foreground transition-colors hover:text-accent"
            >
              {SITE.email}
            </a>
            <div className="mt-5">
              <Button href={SITE.calendly} variant="outline" size="sm">
                Book a call
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Tech.Regardless. Built regardless.</p>
          <p className="font-mono">v1.0 — shipped on caffeine</p>
        </div>
      </div>
    </footer>
  );
}
