# Tech.Regardless

> Websites that work. Regardless.

The portfolio + marketing site for **Tech.Regardless** — a freelance web design
& development practice. Built to convert direct visitors and serve as the
public face when partner agencies route leads here.

This repo is a Next.js 14 (App Router) site, statically rendered where
possible, deploy-ready for Vercel, and structured so that updating content
(case studies, testimonials, pricing) doesn't require touching framework
code.

---

## Tech stack

- **Next.js 14+** with App Router and TypeScript
- **Tailwind CSS** with custom design tokens (HSL CSS variables)
- **Framer Motion** for scroll animations and route transitions
- **Lucide React** for icons
- **next-themes** for the dark/light toggle (dark by default)
- **MDX** (`@next/mdx` + `next-mdx-remote`) for case studies
- **React Hook Form + Zod** for the contact form
- **Resend** for transactional email
- **Geist** sans + mono fonts via `geist/font`

---

## Local development

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in values you have
cp .env.example .env.local

# 3. Run dev server
npm run dev
# → http://localhost:3000
```

Other scripts:

```bash
npm run build       # Production build
npm run start       # Run the production build locally
npm run lint        # ESLint
npm run type-check  # tsc --noEmit
```

The site works fully without the Resend API key — the contact form will
log submissions to the dev console and return a success response. Wire
up Resend before launching.

---

## Adding a new project case study

Case studies live in `/content/projects/` as MDX files. Each project gets
its own `.mdx` file, and the filename becomes the URL slug
(e.g. `olive-and-oak.mdx` → `/work/olive-and-oak`).

**1.** Create a new file: `/content/projects/your-project.mdx`

**2.** Add frontmatter:

```mdx
---
title: "Your Project"
client: "Client Name"
industry: "E-commerce"
year: "2026"
timeline: "4 weeks"
role: "Design + Development"
liveUrl: "https://example.com"
heroImage: "/images/projects/your-project-hero.jpg"
tags: ["Next.js", "Tailwind"]
featured: true
order: 3
tagline: "One line about why this project matters."
challenge: "What was broken before."
solution: "What I built and why it worked."
results:
  - label: "Lighthouse score"
    value: "99 / 100"
  - label: "Conversion rate"
    value: "+38%"
gallery:
  - src: "/images/projects/your-project-1.jpg"
    aspect: "wide"
    caption: "Optional caption."
  - src: "/images/projects/your-project-2.jpg"
    aspect: "split"
  - src: "/images/projects/your-project-3.jpg"
    aspect: "split"
---

Optional long-form MDX content goes here. Use it for the
behind-the-scenes story, decisions you made, anything that doesn't fit
the structured frontmatter.
```

**3.** Drop images into `/public/images/projects/` and reference them by
absolute path (`/images/projects/...`). Use 16:9 hero images at minimum
2000px wide for retina.

**4.** That's it. The project shows up automatically on `/work` and the
home page. `order: 1` is the featured slot on the home page.

---

## Updating testimonials

Testimonials live in `/content/testimonials.json`. Edit the file
directly:

```json
[
  {
    "id": "unique-id",
    "quote": "What the client said. Plain text — no HTML entities needed.",
    "name": "Client Name",
    "role": "Title, Company"
  }
]
```

The home page renders the first three. To show more, edit
`/components/testimonials.tsx`.

---

## Swapping colors and fonts

### Colors

All design tokens are HSL triplets in `/app/globals.css`. To change the
brand accent:

```css
:root {
  /* Light mode */
  --accent: 152 100% 50%;          /* default electric green #00ff88 */
}
.dark {
  /* Dark mode */
  --accent: 152 100% 50%;
}
```

Other tokens you can tweak: `--background`, `--foreground`, `--muted`,
`--muted-foreground`, `--card`, `--border`, `--input`, `--ring`.

### Fonts

Defined in `/app/layout.tsx` using `geist/font/sans` and
`geist/font/mono`. Swap to a different `next/font` family if you want a
different look — keep the CSS variables `--font-geist-sans` and
`--font-geist-mono` consistent so Tailwind picks them up via
`tailwind.config.ts`.

The wordmark in `/components/wordmark.tsx` always uses mono with the
period in `text-accent`.

---

## Environment variables

Documented in `.env.example`. Required for production:

| Variable                  | Purpose                                          |
| ------------------------- | ------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`    | Canonical site URL — used by sitemap, OG, robots |
| `RESEND_API_KEY`          | Resend API key for the contact form              |
| `CONTACT_TO_EMAIL`        | Where contact submissions are delivered          |
| `CONTACT_FROM_EMAIL`      | Verified Resend sender (e.g. `Name <addr>`)      |
| `NEXT_PUBLIC_CALENDLY_URL`| Calendly link surfaced in CTAs                   |

Without `RESEND_API_KEY`, the contact route logs submissions to stdout
and still returns success — useful for local dev.

---

## Contact form (Resend) setup

1. Create a Resend account at <https://resend.com>.
2. Verify your sending domain
   (<https://resend.com/domains>) — add the DNS records they give you to
   your domain registrar. Skip this in development.
3. Create an API key (Settings → API Keys → Create).
4. Set the env vars in `.env.local` for local dev, and add them to your
   Vercel project (Settings → Environment Variables) for production.

The route handler is `/app/api/contact/route.ts`. It validates the
payload with the same Zod schema as the client form, then sends via
Resend.

---

## Deploy to Vercel

This site is set up to deploy with zero configuration changes.

1. Push the repo to GitHub.
2. Go to <https://vercel.com/new> and import the repo.
3. Add environment variables in the Vercel dashboard before deploying.
4. Hit deploy. Vercel auto-detects Next.js — no build settings to touch.

Future pushes to `main` deploy automatically. Pull requests get preview
URLs out of the box.

---

## Custom domain setup

1. In your Vercel project: **Settings → Domains → Add**.
2. Enter your custom domain (e.g. `techregardless.com`).
3. Vercel gives you DNS records (an A record + CNAME, or nameservers
   if you transfer DNS to Vercel).
4. Add those records at your domain registrar (Namecheap, Cloudflare,
   etc.). Propagation usually finishes in under an hour.
5. Update `NEXT_PUBLIC_SITE_URL` in your Vercel env vars to the new
   canonical URL and redeploy.

---

## File structure (high level)

```
app/                    # App Router pages, API, sitemap, OG, layout
  api/contact/          # Contact form POST handler
  work/[slug]/          # Dynamic case-study route
  globals.css           # Design tokens
components/             # All components (ui/ holds primitives)
content/
  projects/             # Case study MDX files
  testimonials.json     # Testimonials data
lib/
  projects.ts           # MDX loader
  utils.ts              # cn(), SITE constants
public/                 # Static assets
mdx-components.tsx      # MDX → Tailwind component overrides
```

---

## Performance & accessibility notes

- All images use `next/image` with explicit `sizes` and lazy loading
  below the fold.
- `prefers-reduced-motion` disables animations site-wide.
- Skip-to-content link, keyboard-navigable accordion, labeled form
  controls.
- Single `<h1>` per page, semantic landmarks (`<main>`, `<nav>`,
  `<article>`, `<footer>`).
- Target: Lighthouse 95+ on all four axes. Run `npm run build && npm run start`
  locally and check with Chrome DevTools to verify before each deploy.

---

## License

Private / All rights reserved. The brand, copy, and design are
Tech.Regardless property. The code structure is yours to learn from.
