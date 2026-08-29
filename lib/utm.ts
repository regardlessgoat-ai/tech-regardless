// UTM capture for cold-email attribution.
//
// The problem this solves: a campaign link lands on whatever page it points at
// — usually the homepage — but the contact form lives on /contact. Reading the
// query string only at submit time would therefore lose the tag on nearly every
// real lead, because by then the visitor has navigated away from the tagged URL.
// So the params are captured on the first page that sees them and held for the
// rest of the visit.
//
// sessionStorage, not localStorage: attribution belongs to the visit, not to the
// browser forever. Nothing survives closing the tab, no identifiers are created,
// nothing is shared across sites — which keeps this consistent with the
// privacy-friendly analytics the site sells, and needs no cookie banner.
//
// Note on the domain redirect: techregardless.com -> tech-regardless.com is a
// Next.js host redirect (next.config.mjs) with no query string on the
// destination, so Next appends the incoming query to the target. The params are
// present in window.location.search by the time this runs.

export type UtmValues = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
};

const STORAGE_KEY = "tr:utm";

// Mirrors the server-side cap in app/api/contact/route.ts. The server is the
// authority — this is only here to avoid sending obvious junk.
const MAX_LEN = 120;

const EMPTY: UtmValues = { utmSource: "", utmMedium: "", utmCampaign: "" };

// sessionStorage throws in some privacy modes and embedded webviews (an iOS
// in-app browser, for instance). Losing attribution is acceptable; breaking the
// contact form is not — so every access is guarded and an in-memory copy backs
// it up for the lifetime of the page.
let memory: UtmValues = EMPTY;

function clean(value: string | null) {
  if (!value) return "";
  return value
    .trim()
    .replace(/[^\w.\-+% ]/g, "")
    .slice(0, MAX_LEN);
}

function hasAny(v: UtmValues) {
  return Boolean(v.utmSource || v.utmMedium || v.utmCampaign);
}

function readStored(): UtmValues | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<UtmValues>;
    return {
      utmSource: clean(parsed.utmSource ?? ""),
      utmMedium: clean(parsed.utmMedium ?? ""),
      utmCampaign: clean(parsed.utmCampaign ?? ""),
    };
  } catch {
    return null;
  }
}

function writeStored(values: UtmValues) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  } catch {
    // Storage unavailable — `memory` still carries it for this page view.
  }
}

/**
 * Reads utm_source / utm_medium / utm_campaign from the current URL, remembers
 * them for the rest of the session, and returns whatever the visit is carrying.
 *
 * Safe to call as often as you like. Call it on mount to capture, and again at
 * submit time to retrieve.
 *
 * A tagged URL always wins — it is an explicit new arrival. An untagged page
 * view never clears an existing tag, which is what lets someone land on
 * /?utm_source=coldemail, browse to /services, then submit from /contact and
 * still be attributed correctly.
 */
export function captureUtm(): UtmValues {
  if (typeof window === "undefined") return EMPTY;

  const params = new URLSearchParams(window.location.search);
  const fromUrl: UtmValues = {
    utmSource: clean(params.get("utm_source")),
    utmMedium: clean(params.get("utm_medium")),
    utmCampaign: clean(params.get("utm_campaign")),
  };

  if (hasAny(fromUrl)) {
    memory = fromUrl;
    writeStored(fromUrl);
    return fromUrl;
  }

  const stored = readStored();
  if (stored && hasAny(stored)) {
    memory = stored;
  }
  return memory;
}
