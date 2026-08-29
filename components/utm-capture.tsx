"use client";

import { useEffect } from "react";
import { captureUtm } from "@/lib/utm";

/**
 * Mounted once in the root layout so a campaign tag is recorded on the *landing*
 * page, whichever page that is. Without this, a lead that arrives on / and
 * submits from /contact would look like direct traffic.
 *
 * Renders nothing. Reads window.location.search directly rather than
 * useSearchParams() on purpose — useSearchParams() in the root layout would opt
 * the entire site out of static rendering.
 */
export function UtmCapture() {
  useEffect(() => {
    captureUtm();
  }, []);

  return null;
}
