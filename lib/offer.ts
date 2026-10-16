// The offer, in one place, so the homepage, Services and the FAQ can't drift.
// Rule: only list what the product does today.

export const PLAN = {
  name: "Full Presence Plan",
  price: "$600/mo",
  title: "Full Presence Plan, $600/mo",
  /** The value stack, in order. */
  includes: [
    "New website built for you, an $1,800 value, included",
    "Missed-call text-back",
    "Job booking over text",
    "Review requests after every job",
    "Website care and updates",
    "Cancel anytime.",
  ],
} as const;

export const GUARANTEE =
  "If your AI Front Desk doesn't make you money from a missed call in the first 30 days, your next 30 days are free.";

/** The backup offer, shown small under the plan. */
export const WEBSITE_ONLY = {
  lead: "Just need a website?",
  price: "$1,800 one-time.",
  href: "/services#websites",
} as const;
