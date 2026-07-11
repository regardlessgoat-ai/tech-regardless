---
name: tech-regardless-design
description: Use when working on the techregardless.com website — design, copy, pages, SEO, case studies, or conversion. Engages the 6-expert panel (BRAND, COPY, FRONTEND, SEO, CONVERSION, BUSINESS) and treats every page as both portfolio AND sales asset. Pushes against generic AI-slop design. Note - for cold email / lead gen / AI Front Desk outreach work, use the front-desk-outreach skill instead; this skill is for the site itself.
---

# tech.regardless — Site Design + Sales Asset

You are working on the techregardless.com website. It serves the operator's business two ways:

1. **Credibility for AI Front Desk outreach** — cold email prospects WILL look up the domain. The site must survive that look.
2. **Portfolio + freelance hub** — showcase real work, convert freelance leads.

Priority check before deep site work: the AI Front Desk outreach pipeline (see `front-desk-outreach` skill) outranks site polish. A good-enough site with an active send queue beats a perfect site with an empty one.

## The expert panel — engage on every change

### [BRAND] — Visual identity
- Distinctive over generic — no AI-slop (gradient hero, glowing buttons, laptop stock photo)
- Confident, plain-English tone; consistent palette + typography; coherent logo/favicon

### [COPY] — Words on the page
- Headlines: clear value prop in < 12 words
- Subheads: what the visitor gets, not what the operator does
- CTAs: action verb + outcome ("Start your project" beats "Contact")
- Read-aloud test: does it sound like a human?

### [FRONTEND] — Code quality
- Mobile-first (test 375px first); Lighthouse 90+ every page
- Accessibility: alt text, semantic HTML, keyboard nav
- Static-first; JS only where genuinely needed; no 200KB libraries for CSS-solvable problems

### [SEO] — Discoverability
- Unique title (< 60 chars) + meta description (< 160) per page
- Schema.org: Person on /about, CreativeWork on case studies; Open Graph tags
- Sitemap.xml + robots.txt
- No blog "for SEO" unless it'll actually be maintained

### [CONVERSION] — Lead capture
- Obvious next step on every page; contact form ≤ 3 fields
- Trust signals: based in Kissimmee/Orlando FL, real name, real work
- Response-time promise that's real ("within 24 hours weekdays"), not "ASAP"
- No exit-intent popups

### [BUSINESS] — Positioning
- Two audiences: home-service owners checking out the AI Front Desk sender, and web dev prospects
- Both service lines visible: AI Front Desk ($697/mo, productized) and website builds (custom-quoted)
- The wedge: local + real shipped production work + honest pricing
- Pricing shown if productized (Front Desk), hidden if truly custom (website builds)

## Case studies — real work only

- **PicMenu** — production-audited restaurant SaaS: 15 themes, 35 languages, 13 live restaurants, full security audit closed. The anchor case study.
- **ForexBot** — AI-governed automated trading system. Frame as an engineering showcase (architecture, safety rails, AI panel governance) — never as financial advice or a performance pitch.
- **Socially Elisa site** — real deployed client work. Credit as client work; it's Elisa's business, not the operator's company.
- **AI Front Desk** — flagship case study once the first client is live.

Never: fake testimonials, projects the operator didn't build, aspirational numbers presented as results.

## Anti-patterns — push back

**Visual:** stock laptop/handshake heroes, glowing gradients, auto-rotating testimonial carousels, skeleton loaders on static pages, scroll-blocking 3D
**Copy:** "innovative solutions," "cutting-edge," "take your business to the next level," "leverage/synergize," "Welcome to…" headlines
**Strategy:** unmaintained blog, purposeless pages ("Resources," "Insights"), buried contact info, site-polishing while outreach sits idle

## Recommended stack

- Static-first: Astro or pure HTML/CSS · Vercel free hosting · Plausible or Vercel Analytics free tier
- Forms: Vercel form action or Formspree free · Icons: Lucide/Phosphor · Fonts: Google Fonts (Inter + one serif accent)
- Not recommended: full-SSR Next.js (overkill), WordPress, Wix/Squarespace

## Don't ship until

- Lighthouse Mobile + Desktop both 90+
- Unique title + meta per page; all images have alt text
- Contact form tested end-to-end to the operator's inbox
- Mobile rendering checked on a real phone
- Custom 404
- Every page passes: "Would I share this URL with a cold-email prospect who just Googled me?"
