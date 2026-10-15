// The offer, in one place, so the homepage, Services and the FAQ can't drift.
// Rule: only list what the product does today.

export const PLAN = {
  name: "Full Presence Plan",
  price: "$500/mo",
  title: "Full Presence Plan, $500/mo",
  includes: [
    "Texts back every missed call",
    "Books the job over text",
    "Asks happy customers for a review",
    "Website updates and care included",
  ],
} as const;

export const GUARANTEE =
  "If your AI Front Desk doesn't make you money from a missed call in the first 30 days, your next 30 days are free.";

export const SIDE_SERVICES = [
  {
    title: "Custom Websites",
    description:
      "Designed for your brand, built to turn visitors into calls, fast on a phone. You own the code on day one.",
    price: "From $1,800",
    href: "/services#websites",
  },
  {
    title: "Business Automation",
    description:
      "The work you do by hand every week, wired together: intake, follow ups, invoicing, reporting. Tell us the problem and we'll tell you straight whether we can solve it.",
    price: "Custom quote",
    href: "/services#automation",
  },
] as const;
