---
name: tech-regardless-design
description: Use when working on tech.regardless — the operator's personal portfolio and freelance web developer hub. Engages the 6-expert panel (BRAND, COPY, FRONTEND, SEO, CONVERSION, BUSINESS) and treats every page as both portfolio AND sales asset. Pushes against generic AI-slop design.
---

# tech.regardless — Personal Brand + Sales Asset

You are working on tech.regardless. Every page serves two jobs:

1. **Portfolio** — showcase the operator's work (PicMenu, Socially Elisa, ForexBot)
2. **Sales hub** — convert visitors into freelance web development clients

If a page or element doesn't serve one of these two jobs, kill it.

## The expert panel — engage on every change

### [BRAND] — Visual identity
- Distinctive over generic — no AI-slop (gradient hero, glowing buttons, laptop stock photo)
- Tone of voice: confident, plain English, no jargon padding
- Color palette + typography consistent across pages
- Logo treatment + favicon coherent

### [COPY] — Words on the page
- Headlines: clear value prop in < 12 words
- Subheads: what the visitor gets, not what the operator does
- Microcopy: button text > "Submit" / "Click here" / "Learn more"
- CTAs: action verb + outcome ("Start your project" beats "Contact")
- Read aloud test: does it sound like a human?

### [FRONTEND] — Code quality
- Mobile-first (test 375px first)
- Lighthouse score 90+ on every page
- Accessibility: alt text, semantic HTML, keyboard nav
- No 200KB JavaScript libraries for things CSS can do
- Static-first (HTML/CSS); JS only where genuinely needed

### [SEO] — Discoverability
- Title tags unique per page, < 60 chars
- Meta description per page, < 160 chars
- Schema.org: Person on /about, CreativeWork on /case-studies
- Open Graph tags for social sharing
- Sitemap.xml + robots.txt
- No blog "for SEO" unless the operator will actually maintain it

### [CONVERSION] — Lead capture
- Every page has an obvious next step (contact, view work, hire CTA)
- Friction-free contact form: name, email, what they need (3 fields max)
- Social proof above the fold (case study count, testimonial, logo)
- Trust signals: "based in Florida," real photo, real name
- No exit-intent popups (annoying, low-converting)

### [BUSINESS] — Positioning
- Who is this for? (One specific persona — small business owners? Restaurants? Technical founders?)
- What problem do they have? (Specific, not "they need a website")
- Why pick the operator? (Speed? Local? Bilingual? Honest pricing? Niche expertise?)
- Pricing: shown if productized; hidden if truly custom

## Anti-patterns — push back

### Visual
- Hero with stock photo of laptop / handshake / arrow chart
- Glowing button gradients
- Floating chat widget on a portfolio site
- 6 testimonials in a carousel that auto-rotates
- Skeleton loaders on a static page
- 3D animations that block scrolling

### Copy
- "Innovative solutions"
- "Cutting-edge"
- "Take your business to the next level"
- "Synergize / leverage / utilize"
- "Welcome to [name]" headlines
- Walls of text without structure

### Strategy
- A blog you won't maintain
- Pages with no clear purpose ("Resources," "Insights")
- Fake testimonials
- Showcasing projects you didn't build
- Hiding contact info behind too many clicks

## What "production-grade" looks like

For each page, ask:

1. Would I share this URL with a paying client confidently?
2. Does it load in < 2 seconds on a phone with average cellular?
3. Does it pass the accessibility checker?
4. Is the CTA clear?
5. Is there ONE specific person this page is for?

If any answer is no, the page isn't ready.

## Recommended stack (working assumption)

Simpler is better for a portfolio:
- **Static site generator:** Astro (excellent for portfolios) or pure HTML/CSS
- **Hosting:** Vercel free tier
- **Domain:** tech.regardless (already owned)
- **Analytics:** Plausible free tier or Vercel Analytics
- **Forms:** Vercel form action or Formspree free tier
- **Images:** Cloudinary free OR self-hosted with proper compression
- **Icons:** Phosphor / Lucide (free, distinctive)
- **Fonts:** Inter + a serif accent (Playfair Display, EB Garamond)

NOT recommended for a portfolio site:
- Next.js with full SSR (overkill, slow build, deploy complexity)
- WordPress (you'll fight it, and it shows)
- Wix / Squarespace (signals "generic," limits future flexibility)

## Pages worth having

Order matters — these are roughly the visitor's path:

1. **Home** — hero with clear value prop, immediate proof of capability, primary CTA
2. **Work / Case Studies** — PicMenu, Socially Elisa, ForexBot (real screenshots, real outcomes when launched)
3. **About** — short version, why operator does this, headshot
4. **Services** — what someone can hire for, with rough pricing if productized
5. **Contact** — frictionless form + alternate channels (email, phone if comfortable)

Maybe later:
6. **Notes / Writing** — only if operator will actually write
7. **Process** — how operator works with clients (deliverables, timelines)

## Page-specific [CONVERSION] notes

- **Home:** Primary CTA above the fold. Secondary CTA at scroll end.
- **Case studies:** Each one ends with "Want similar results? [CTA]"
- **Services:** Tier comparison if productized. Phone call CTA if custom.
- **Contact:** Confirmation that says when operator typically responds (not "we'll get back to you ASAP" — give a real timeframe like "within 24 hours weekdays").

## Don't ship until

- Lighthouse Mobile + Desktop both 90+
- Every page has a unique title and meta description
- All images have alt text
- Contact form actually sends to operator's email (tested)
- Mobile rendering tested on real iPhone (not just Chrome DevTools)
- 404 page is custom, not browser default
