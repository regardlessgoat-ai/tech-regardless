import type { Metadata } from "next";
import { SITE } from "@/lib/utils";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

/**
 * The site-wide share image, app/opengraph-image.tsx. Next only attaches that
 * file to pages that don't set their own `openGraph`, so pages that do get it
 * from here. Twitter falls back to the Open Graph image.
 */
export const SHARE_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${SITE.name} | ${SITE.tagline}`,
  type: "image/png",
};

/**
 * Site-wide Open Graph tags. A page that sets `openGraph` replaces the
 * layout's object instead of merging with it, so every page builds its own
 * from these defaults via openGraphFor() and only changes what differs.
 */
export const BASE_OPEN_GRAPH = {
  type: "website",
  siteName: SITE.name,
  title: `${SITE.name} | ${SITE.tagline}`,
  description: SITE.description,
  locale: "en_US",
} satisfies OpenGraph;

/** Open Graph for one page: the defaults, its own og:url, plus any overrides. */
export function openGraphFor(path: string, overrides: OpenGraph = {}): OpenGraph {
  return { ...BASE_OPEN_GRAPH, images: [SHARE_IMAGE], url: path, ...overrides };
}
