# Tech.Regardless — Project Reference

A complete map of what was built, where it lives, and how it fits together.
This is the canonical reference for the Tech.Regardless portfolio site.

> Brand: **Tech.Regardless** — *Websites that work. Regardless.*
> Built: 2026-05-09 · Stack: Next.js 14 App Router + TypeScript

---

## Table of contents

1. [Project goal & positioning](#1-project-goal--positioning)
2. [Tech stack](#2-tech-stack)
3. [Routes & pages](#3-routes--pages)
4. [Home page sections](#4-home-page-sections)
5. [Components inventory](#5-components-inventory)
6. [Design system](#6-design-system)
7. [Content sources](#7-content-sources)
8. [API routes](#8-api-routes)
9. [SEO & metadata](#9-seo--metadata)
10. [Accessibility & performance](#10-accessibility--performance)
11. [Environment variables](#11-environment-variables)
12. [Deploy](#12-deploy)
13. [File tree](#13-file-tree)
14. [Pre-launch checklist](#14-pre-launch-checklist)

---

## 1. Project goal & positioning

A senior-agency-quality portfolio + marketing site for a freelance web
designer/developer who:

- Receives leads from a partner marketing agency
- Wants to convert direct visitors into clients
- Refuses to look like a generic Wix/Webflow template

**Brand voice:** Confident, direct, no fluff. Short sentences. Strong
verbs. The "regardless" is the whole positioning — obstacles don't stop
the work from shipping.

**Taglines used throughout:**
- Websites that work. Regardless.
- Built different. Delivered regardless.
- Your vision. My code. No excuses.

---

## 2. Tech stack

| Layer            | Choice                                              |
| ---------------- | --------------------------------------------------- |
| Framework        | Next.js 14.2 (App Router, RSC)                      |
| Language         | TypeScript (strict)                                 |
| Styling          | Tailwind CSS 3.4 + custom HSL design tokens         |
| Animations       | Framer Motion 11 (scroll reveals + route transitions) |
| Icons            | Lucide React                                        |
| Theme            | next-themes (dark default, light toggle)            |
| Fonts            | Geist Sans + Geist Mono via `geist/font`            |
| Forms            | React Hook Form + Zod                               |
| Email            | Resend (with dev-mode console fallback)             |
| Content          | MDX (`@next/mdx` + `next-mdx-remote/rsc`)           |
| Frontmatter      | gray-matter                                         |
| Class merging    | clsx + tailwind-merge                               |
| Deploy target    | Vercel (zero-config)                                |

---

## 3. Routes & pages

| Route               | File                              | Purpose                                          |
| ------------------- | --------------------------------- | ------------------------------------------------ |
| `/`                 | `app/page.tsx`                    | Single-scroll home page (10 sections)            |
| `/work`             | `app/work/page.tsx`               | All projects index                               |
| `/work/[slug]`      | `app/work/[slug]/page.tsx`        | Dynamic case study (statically generated)        |
| `/services`         | `app/services/page.tsx`           | Pricing tiers + always-included + pricing FAQ    |
| `/contact`          | `app/contact/page.tsx`            | Form + alternative contact methods               |
| `/api/contact`      | `app/api/contact/route.ts`        | POST handler — Zod validation + Resend send      |
| `/sitemap.xml`      | `app/sitemap.ts`                  | Auto-generated, includes all case studies        |
| `/robots.txt`       | `app/robots.ts`                   | Allows all, blocks `/api/`                       |
| `/opengraph-image`  | `app/opengraph-image.tsx`         | Edge-rendered 1200×630 PNG                       |
| 404                 | `app/not-found.tsx`               | Custom 404 with brand voice                      |

Layout (`app/layout.tsx`) wraps every page with: theme provider, nav,
footer, skip-to-content link, dark default + light toggle, all metadata.

Route transitions live in `app/template.tsx` — fade-up on every
navigation, honors `prefers-reduced-motion`.

---

## 4. Home page sections

In scroll order, all rendered from `app/page.tsx`:

| #  | Section          | File                              | What it does                                                                 |
| -- | ---------------- | --------------------------------- | ---------------------------------------------------------------------------- |
| 1  | Navigation       | `components/nav.tsx`              | Sticky, transparent → backdrop-blur on scroll. Wordmark left, links + CTA right. Mobile drawer below 768px. |
| 2  | Hero             | `components/hero.tsx`             | Full viewport. Massive headline. Status pill + 2 CTAs + meta strip (response/timeline/based). Gradient mesh + grid overlay + grain. |
| 3  | Trust bar        | `components/trust-bar.tsx`        | 5 grayscale partner logos placeholder. Hover restores color.                 |
| 4  | Services         | `components/services-section.tsx` | 3 service cards (Custom / Redesigns / Support) with icon, price, hover lift. |
| 5  | Featured Work    | `components/work-grid.tsx`        | Asymmetric grid: 1 large featured + 2 secondary + dashed empty slots.        |
| 6  | Process          | `components/process-section.tsx`  | 4-step horizontal timeline with connecting line. Discovery → Design → Build → Launch. |
| 7  | Testimonials     | `components/testimonials.tsx`     | 3 cards from `content/testimonials.json`.                                    |
| 8  | FAQ              | `components/faq.tsx`              | 6-item accordion: timeline, pricing, revisions, post-launch, hosting, existing site. |
| 9  | Final CTA        | `components/cta-section.tsx`      | Full-width, accent gradient mesh + grid mask. Big headline + email + Start button. |
| 10 | Footer           | `components/footer.tsx`           | 3-column: wordmark+social / nav / contact + book-call. Bottom row copyright. |

Plus JSON-LD (Person + ProfessionalService schema) injected at the top
of `/`.

---

## 5. Components inventory

### App-level components (`components/`)

| File                        | Used by                                  |
| --------------------------- | ---------------------------------------- |
| `nav.tsx`                   | layout                                   |
| `footer.tsx`                | layout                                   |
| `theme-provider.tsx`        | layout (wraps everything)                |
| `theme-toggle.tsx`          | nav                                      |
| `wordmark.tsx`              | nav, footer                              |
| `reveal.tsx`                | every section that animates on scroll    |
| `status-pill.tsx`           | hero                                     |
| `hero.tsx`                  | home                                     |
| `trust-bar.tsx`             | home                                     |
| `services-section.tsx`      | home                                     |
| `work-grid.tsx`             | home, /work                              |
| `process-section.tsx`       | home                                     |
| `testimonials.tsx`          | home                                     |
| `faq.tsx`                   | home                                     |
| `cta-section.tsx`           | home, /work, /services                   |
| `contact-form.tsx`          | /contact                                 |

### UI primitives (`components/ui/`)

| File                  | Exports                                          |
| --------------------- | ------------------------------------------------ |
| `button.tsx`          | `Button` — polymorphic (button/link), 4 variants × 3 sizes |
| `card.tsx`            | `Card`, `CardHeader`, `CardBody`, `CardFooter`   |
| `input.tsx`           | `Input`, `Textarea`, `Select`, `Label`, `FieldError` |
| `badge.tsx`           | `Badge` — default / accent / outline             |
| `accordion.tsx`       | `Accordion` (single-open, controlled internally) |
| `section-heading.tsx` | `SectionHeading` — eyebrow + title + description, supports `as="h1"` |

### Helpers

| File           | Exports                                                       |
| -------------- | ------------------------------------------------------------- |
| `lib/utils.ts` | `cn()` (clsx+tailwind-merge), `SITE` constants object         |
| `lib/projects.ts` | `getAllProjects()`, `getProjectBySlug()`, `getAdjacentProjects()` |
| `mdx-components.tsx` | MDX → Tailwind component overrides (h1-h3, p, a, strong) |

---

## 6. Design system

### Color tokens (HSL triplets, defined in `app/globals.css`)

| Variable                | Dark (default)    | Light             | Purpose                       |
| ----------------------- | ----------------- | ----------------- | ----------------------------- |
| `--background`          | `0 0% 4%` (#0a0a0a) | `60 18% 98%` (#fafaf7) | Page background              |
| `--foreground`          | `0 0% 98%` (#fafafa) | `0 0% 4%` (#0a0a0a) | Body text                     |
| `--muted`               | `0 0% 9%` (#171717) | `60 9% 94%`        | Subtle surfaces               |
| `--muted-foreground`    | `240 5% 65%` (#a1a1aa) | `240 4% 46%`    | Secondary text                |
| `--card`                | `0 0% 7%`         | `0 0% 100%`       | Card surface                  |
| `--border`              | `0 0% 15%` (#262626) | `240 6% 88%`    | Borders / dividers            |
| `--input`               | `0 0% 12%`        | `240 6% 92%`      | Form fields                   |
| `--accent`              | `152 100% 50%` (#00ff88) | same       | Brand accent (electric green) |
| `--accent-foreground`   | `0 0% 4%`         | `0 0% 4%`         | Text on accent surfaces       |

### Typography

- **Display + body:** Geist Sans (`var(--font-geist-sans)`)
- **Mono / wordmark / labels:** Geist Mono (`var(--font-geist-mono)`)
- **Scale:** Hero `text-5xl → text-7xl` (`text-[7.5rem]` on lg). Section
  titles `text-4xl → text-6xl`. Body `text-base → text-lg`.
- **Letter spacing:** `tracking-tight` on display, `tracking-[0.2em]
  uppercase` on mono eyebrows.
- **Wordmark:** Geist Mono. The period `.` is rendered in
  `text-accent`. Always via `<Wordmark />`.

### Radius scale (small only — no bubbly cards)

```
none:0  sm:2px  DEFAULT:4px  md:6px  lg:8px  xl:12px
```

### Shadows

- `shadow-soft` — subtle 1–3px shadow
- `shadow-layered` — multi-stop shadow used on hovered cards
- `shadow-glow` — accent-tinted glow for emphasis (CTA hover, popular tier)

### Custom keyframes / animations

- `fade-up` — initial reveal
- `pulse-dot` — status indicator
- `gradient-shift` — slow-shifting background for hero/CTA
- `shimmer` — reserved for future loading states

### Reusable utilities (custom in `globals.css`)

- `.container-tight` — `max-w-6xl`
- `.container-wide` — `max-w-7xl`
- `.gradient-mesh` — radial-gradient background used in hero & CTA
- `.texture-grain` — SVG noise overlay (6% opacity)
- `.text-balance` — `text-wrap: balance`
- `.focus-ring` — accent ring for keyboard focus

### Reduced motion

Global `@media (prefers-reduced-motion: reduce)` rule disables all
animations and transitions. The `Reveal` component and `Template` route
transition both honor it via `useReducedMotion()`.

---

## 7. Content sources

### Case studies — `content/projects/*.mdx`

Each MDX has structured frontmatter (challenge, solution, results,
gallery, tags) plus optional long-form body. Two samples ship with the
project:

| Slug              | Industry    | Featured | Order |
| ----------------- | ----------- | -------- | ----- |
| `olive-and-oak`   | Hospitality | true     | 1     |
| `fleetbase`       | SaaS        | true     | 2     |

The MDX loader (`lib/projects.ts`) reads the directory at build time;
new files appear automatically on `/work` and the home page.

### Testimonials — `content/testimonials.json`

3 sample testimonials with realistic copy in brand voice. Plain text —
no HTML entities. Edit the JSON to add/remove.

### Hardcoded copy

These live inside component files (intentional — they're tied to layout):

- Hero headline + subhead → `components/hero.tsx`
- Service tier copy → `components/services-section.tsx`
- Process steps → `components/process-section.tsx`
- FAQ items → `components/faq.tsx`
- Pricing tiers + always-included + pricing FAQ → `app/services/page.tsx`

---

## 8. API routes

### `POST /api/contact` — `app/api/contact/route.ts`

**Input** (validated via Zod, same schema as the client):

```ts
{
  name: string (min 2),
  email: string (valid email),
  company?: string,
  projectType: "new-website" | "redesign" | "ongoing-support" | "exploring",
  budget: "under-2k" | "2k-5k" | "5k-10k" | "10k-plus" | "not-sure",
  message: string (min 10),
}
```

**Response:**
- `200 { ok: true }` on success
- `400` invalid JSON
- `422 { error, issues }` on validation failure
- `502 { error }` on Resend failure

**Behavior:**
- If `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` are all
  set → sends email via Resend with `replyTo` set to the submitter.
- Otherwise → logs the formatted submission to stdout and returns 200.
  Form keeps working in dev with no setup.

---

## 9. SEO & metadata

| Mechanism              | Where                                            |
| ---------------------- | ------------------------------------------------ |
| Default + per-page metadata | `app/layout.tsx` + each page's `metadata` export |
| OpenGraph + Twitter card | `metadata.openGraph` + `metadata.twitter`        |
| Title template         | `%s — Tech.Regardless`                           |
| Sitemap                | `app/sitemap.ts` — static routes + every project |
| Robots                 | `app/robots.ts` — allow all, disallow `/api/`    |
| OG image               | `app/opengraph-image.tsx` — edge-rendered 1200×630 |
| JSON-LD                | `app/page.tsx` — Person + ProfessionalService    |
| Canonical              | Set per page via `metadata.alternates.canonical` |
| Theme color            | Set per color scheme via `viewport.themeColor`   |

---

## 10. Accessibility & performance

### Accessibility

- Skip-to-content link (top of body, focus-visible)
- Single `<h1>` per page (Hero on home, page title elsewhere)
- Semantic landmarks: `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
- All form fields have `<Label>`, `aria-invalid`, error text in
  `role="alert"`
- Accordion uses `aria-expanded` and `aria-controls`
- Theme toggle has dynamic `aria-label`
- Icons are `aria-hidden`; meaningful interactive text isn't
- All images have descriptive `alt` text
- `prefers-reduced-motion` respected globally + per component

### Performance

- `next/image` everywhere — proper `sizes`, `priority` only above fold,
  `loading="lazy"` elsewhere
- `next/font` (Geist) — no FOIT/FOUT
- Static generation: all routes pre-rendered (`generateStaticParams` for
  case studies)
- No external font CDNs, no client-side data fetching on render path
- Single accent color — no heavy gradients on critical paint
- Target: Lighthouse 95+ on Performance / A11y / Best Practices / SEO

---

## 11. Environment variables

Documented in `.env.example`:

| Var                         | Required for production?         |
| --------------------------- | -------------------------------- |
| `NEXT_PUBLIC_SITE_URL`      | yes                              |
| `RESEND_API_KEY`            | yes (otherwise contact = no-op)  |
| `CONTACT_TO_EMAIL`          | yes                              |
| `CONTACT_FROM_EMAIL`        | yes (must be verified in Resend) |
| `NEXT_PUBLIC_CALENDLY_URL`  | recommended                      |

---

## 12. Deploy

Zero-config Vercel:

1. Push to GitHub
2. Import at <https://vercel.com/new>
3. Add env vars (Settings → Environment Variables)
4. Deploy — Vercel auto-detects Next.js

For a custom domain: Settings → Domains → Add → follow Vercel's DNS
instructions → update `NEXT_PUBLIC_SITE_URL` and redeploy.

---

## 13. File tree

```
tech-regardless/
├── app/
│   ├── api/contact/route.ts
│   ├── contact/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── opengraph-image.tsx
│   ├── page.tsx
│   ├── robots.ts
│   ├── services/page.tsx
│   ├── sitemap.ts
│   ├── template.tsx
│   ├── work/
│   │   ├── [slug]/page.tsx
│   │   └── page.tsx
├── components/
│   ├── contact-form.tsx
│   ├── cta-section.tsx
│   ├── faq.tsx
│   ├── footer.tsx
│   ├── hero.tsx
│   ├── nav.tsx
│   ├── process-section.tsx
│   ├── reveal.tsx
│   ├── services-section.tsx
│   ├── status-pill.tsx
│   ├── testimonials.tsx
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   ├── trust-bar.tsx
│   ├── wordmark.tsx
│   ├── work-grid.tsx
│   └── ui/
│       ├── accordion.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── section-heading.tsx
├── content/
│   ├── projects/
│   │   ├── fleetbase.mdx
│   │   └── olive-and-oak.mdx
│   └── testimonials.json
├── docs/
│   └── REFERENCE.md         ← this file
├── lib/
│   ├── projects.ts
│   └── utils.ts
├── public/
│   ├── fonts/
│   └── images/projects/
├── .env.example
├── .gitignore
├── README.md
├── mdx-components.tsx
├── next.config.mjs
├── next-env.d.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## 14. Pre-launch checklist

What you still need to provide / configure before going live:

- [ ] **Project images** → `public/images/projects/*`, update each
      `.mdx` `heroImage` and `gallery.src`
- [ ] **Real testimonials** → `content/testimonials.json`
- [ ] **Partner agency logos** → `components/trust-bar.tsx`, drop SVGs
      into `public/images/logos/`
- [ ] **Calendly URL** → `NEXT_PUBLIC_CALENDLY_URL`
- [ ] **Domain** → buy + connect via Vercel
- [ ] **Resend** → sign up, verify domain, set the 3 env vars
- [ ] **Social handles** → `lib/utils.ts` `SITE.social`
- [ ] **More case studies** → drop `.mdx` files into `content/projects/`
- [ ] **Lighthouse audit** → `npm run build && npm run start`, then
      Chrome DevTools → confirm 95+ across the board

Search the codebase for `TODO:` to find every placeholder marked for
replacement.
