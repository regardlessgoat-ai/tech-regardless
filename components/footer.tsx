import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/utils";

const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
  { href: "/#faq", label: "FAQ" },
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
              <Button href="/contact" variant="outline" size="sm">
                Start a conversation
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Tech.Regardless. Built regardless.</p>
          <Link href="/sms-policy" className="transition-colors hover:text-foreground">
            Privacy &amp; Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
