# CLAUDE.md — tech.regardless

> Read this file in full before any work. tech.regardless is the operator's business entity. Two service lines, one clear priority.

## Mission 1 (PRIMARY) — AI Front Desk

Sell an "AI Front Desk" service to home-service businesses (HVAC, plumbing, electrical, pest control) in the Kissimmee/Orlando area — Osceola and Orange counties.

- **The offer:** missed-call text-back + AI booking agent + automated review requests
- **Price:** $697/month
- **Channel:** written cold email, primary and only channel for now
- **Target:** ~12 clients to hit the revenue floor
- **THE RULE: no product gets built until someone pays.** Sell first. This rule outranks every cool implementation idea. If a task smells like building the product pre-sale, stop and flag it.

## Mission 2 — Website builds (service line)

Custom website design and builds for businesses — the freelance web dev arm of tech.regardless.

- **Who buys it:** local small businesses, freelance leads through the site, and home-service prospects from the outreach pipeline. A prospect who isn't ready for the $697/mo Front Desk but has a bad or missing website is a website lead — the two offers feed each other.
- **Pricing:** custom-quoted per project for now (productize with set tiers once a few builds establish the pattern)
- **Proof it's real:** deployed client work already exists (see Clients below), plus PicMenu as a full-SaaS showcase
- **Delivery model:** operator strategizes and sells; Claude Code builds

## Mission 3 — The techregardless.com site itself

Portfolio + credibility hub. Cold-email prospects WILL Google the domain — the site's job is to survive that look and convert freelance leads. Polish it when outreach work doesn't need doing; a good-enough site with an active send queue beats a perfect site with an empty one.

## Current phase

**PRE-OUTREACH — DELIVERABILITY SETUP.** Infrastructure is nearly ready; the next milestone is starting the email warm-up, then the first cold sends.

## Status snapshot — update this section as things change

*Last updated: July 2026*

- Domain `techregardless.com` live on Namecheap
- Google Workspace Business Starter on 14-day trial — **watch the trial end date; this converts to paid.** Workspace is the one justified paid tool here: cold email from a free Gmail address lands in spam and burns the domain.
- DNS configured: SPF, DKIM, DMARC, MX. **DKIM propagation pending** — warm-up starts after it verifies.
- Queued: Claude Code lead scraper targeting Google Maps home-service businesses in Osceola + Orange counties
- Sequence: DKIM verifies → warm-up phase → lead list build → first cold sends

## Clients

### Socially Elisa (active — website + billing support)

Elisa's social media management agency. She owns the business; tech.regardless is her developer/ops support. Live site: socially-elisa-site.vercel.app. Rules when working on her stuff:

1. **NO PRICES on her public website — ever.** Package names + features only, Get-a-Quote funnel. Push back hard if asked to add prices.
2. **Custom Stripe Payment Link per client** after her discovery calls; combo links (Social + Branding tiers on one link) allowed. Stripe Customer Portal should be activated; products still need the test-mode → live-mode migration (recreate all six products, update referenced IDs, verify webhook).
3. **BRL buffer:** her branding helper (Rebeca) is paid in BRL — keep a 10–15% buffer in branding-tier margins and flag pricing for Elisa if USD/BRL drops below ~4.50. Her social media helper (Jamilly) is paid USD.
4. **Business decisions are Elisa's.** Model the numbers, build the systems, route the calls to her.
5. Credit this as client work everywhere — it's her company, not the operator's.

New clients get added here as they sign.

## Deliverability rules — the domain is the asset, protect it

1. **Never send cold email before warm-up completes.** A burned domain is weeks of recovery or a new domain.
2. **Ramp volume slowly.** Start single digits per day, increase gradually. No blasting.
3. **CAN-SPAM basics on every send:** truthful subject lines, a physical mailing address in the footer, a working opt-out that gets honored immediately.
4. **One clean list beats three scraped ones.** Verify emails before sending; bounces kill sender reputation.
5. **Plain text over HTML templates** for cold outreach. It delivers better and reads more human.
6. **SPF/DKIM/DMARC stay green.** Any DNS change gets re-verified before the next send.

## Cold email copy rules

- Short. Under ~100 words for a first touch.
- Lead with THEIR problem (missed calls = missed jobs), not our product.
- One CTA, low commitment ("worth a quick call?" beats "book a demo").
- No spam-trigger formatting: no ALL CAPS, no walls of links, no attachments on cold sends.
- Local angle is the wedge — we're in Kissimmee, they're in Kissimmee. Use it.
- If a prospect is a better fit for a website build than the Front Desk, pivot the thread — a website client is still a client.

## The site — expert panel for Mission 3 work

Tag findings when working on the site:

- **[BRAND]** — visual identity, tone, consistency. Distinctive over generic — no AI-slop design.
- **[COPY]** — headlines, CTAs, microcopy. Sound like a human.
- **[FRONTEND]** — mobile-first, Lighthouse 90+, accessibility, static-first
- **[SEO]** — unique titles/metas, schema.org, sitemap, Open Graph
- **[CONVERSION]** — clear next step on every page, frictionless contact, real trust signals
- **[BUSINESS]** — positioning: two audiences (home-service owners vetting the sender, freelance web leads), both service lines visible

## Case studies pipeline

Real work exists — use it when building the site:

- **PicMenu** — production-audited restaurant SaaS, 15 themes, 35 languages, 13 live restaurants. Screenshot-ready.
- **Socially Elisa site** — deployed client website. Credit as client work.
- **ForexBot** — AI-governed trading system (frame carefully: engineering showcase, not financial advice)
- **AI Front Desk** — becomes the flagship case study after the first paying client

## Standards — non-negotiable

1. **The no-product-until-paid rule** for AI Front Desk. Repeated because it's the one most at risk from an eager coding agent. (Website builds are exempt — those are sold as builds by nature.)
2. Free tiers everywhere except Workspace. Vercel free hosting, free analytics tier, free fonts/icons.
3. Mobile-first, Lighthouse 90+ on every page of any site shipped — the operator's or a client's.
4. Real work, real numbers on the site. No fake testimonials, no projects the operator didn't build.
5. Lead scraper respects rate limits and only collects publicly listed business contact info.

## Anti-patterns — push back if I'm doing these

- Building the AI Front Desk product before a sale — flag it, every time
- Sending cold email before DKIM verifies and warm-up completes
- Buying tools (email sequencers, verifiers, CRMs) before free options are exhausted
- Underpricing website builds to land a deal — custom quote with real margin, or pass
- Generic AI-slop site design — gradient heroes, stock laptop photos, "innovative solutions" copy
- A blog "for SEO" that won't be maintained
- Perfecting the website while the outreach pipeline sits idle — Mission 1 pays the bills

## Operator info

- I'm the operator/strategist. Claude Code does the implementation.
- Chromebook, Crostini Linux container.
- Pre-revenue. Free tiers, except Workspace (justified).
- Honest read first. Curse if earned. Push back on bad calls — especially scope creep toward building product pre-sale.
