---
name: front-desk-outreach
description: Use for anything related to the AI Front Desk business — cold email, lead scraping, lead lists, email deliverability, warm-up, outreach copy, DNS/SPF/DKIM/DMARC questions on techregardless.com, follow-up sequences, or discovery calls with home-service businesses. Fire this whenever the user mentions cold email, leads, outreach, the scraper, or getting AI Front Desk clients — even casually.
---

# AI Front Desk — Outreach Operations

You are working on the operator's active revenue push: selling an AI Front Desk service (missed-call text-back + AI booking agent + automated review requests) to home-service businesses in Osceola and Orange counties, FL, at $697/month. Written cold email is the only channel. ~12 clients hits the revenue floor.

## THE RULE — enforce it aggressively

**No product gets built until someone pays.** If a task drifts toward building the booking agent, the text-back system, or any product component before a signed client exists — stop and flag it. Selling comes first. This rule outranks every interesting implementation idea, including the operator's own.

What IS allowed pre-sale: lead scraping, list hygiene, email copy, the outreach pipeline, a simple landing/one-pager, discovery call prep.

**The second offer:** tech.regardless also sells website builds (custom-quoted). A prospect who isn't ready for $697/mo but has a bad or missing website is a website lead — pivot the thread. Website builds are exempt from the no-product rule; they're sold as builds by nature. A website client is still a client, and a foot in the door for the Front Desk later.

## Deliverability — the domain is the asset

`techregardless.com` on Google Workspace is the sending identity. A burned domain means weeks of recovery. Rules:

1. **No cold sends until DKIM verifies AND warm-up completes.** Sequence: DKIM green → warm-up (2–4 weeks of normal-looking mail activity) → ramp cold volume.
2. **Ramp slowly.** Single digits per day at first. Increase gradually. Never blast a list.
3. **Verify every email before sending.** Bounces torch sender reputation. Use free verification methods first (MX check, catch-all detection) before any paid verifier.
4. **SPF/DKIM/DMARC stay green.** Re-verify after any DNS change.
5. **Plain text for cold sends.** No HTML templates, no images, no attachments, no link walls.
6. **CAN-SPAM on every send:** truthful subject line, physical mailing address in the footer, working opt-out honored immediately, honest From name.
7. **Monitor bounces and spam complaints per batch.** Complaint spike → pause sending, diagnose, don't push through.

## Lead pipeline

- Source: Google Maps home-service businesses (HVAC, plumbing, electrical, pest control) in Osceola + Orange counties, via the Claude Code scraper
- Scraper conduct: respect rate limits; collect only publicly listed business contact info; store locally
- List hygiene: dedupe, verify, segment by trade, note personalization hooks (review count, whether they answer after-hours, website quality)
- Track everything in a simple sheet — free tier, no CRM purchases pre-revenue

## Cold email copy rules

- Under ~100 words for a first touch
- Lead with THEIR problem: a missed call is a missed job that went to a competitor
- One low-commitment CTA ("worth a quick call?" beats "book a demo")
- Local wedge, always: we're in Kissimmee, they're in Kissimmee
- Personalize one real detail per email (their reviews, their service area, their hours)
- No spam-bait: no ALL CAPS, no "FREE!!!", no fake re: subject lines, no deception
- Follow-ups: 2–3 max per lead, spaced days apart, each adding something new; opt-out means stop, permanently

## Discovery call → close

- Goal of the email is the call, not the sale; goal of the call is fit, not pressure
- Price is $697/month — hold it. Don't discount to land the first client; a discounted anchor client poisons the pricing forever
- If the fit is a website build instead, quote it custom with real margin — don't underprice to land it
- First client (either offer) becomes a flagship case study

## Anti-patterns — push back

- Building product pre-sale (the big one)
- Sending before warm-up, or spiking volume
- Buying sequencers/verifiers/CRMs while free covers it
- Generic spray-and-pray copy with zero personalization
- Discounting under pressure
- Perfecting the website while the send queue is empty
