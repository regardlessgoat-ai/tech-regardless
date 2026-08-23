import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
  experimental: {
    mdxRs: true,
  },

  // DOMAIN UNIFICATION (2026-08-22)
  // Two domains exist and they are NOT interchangeable:
  //   tech-regardless.com  -> this website (live on Vercel)
  //   techregardless.com   -> Google Workspace mail (ali@techregardless.com)
  // The mail domain served no website at all, so a prospect who received a cold
  // email and typed the address out of the "From" line landed on a dead host —
  // losing the single most qualified visitor there is.
  //
  // These rules catch that host and forward it here, preserving path and query so
  // UTM tags on cold-email links survive the hop.
  //
  // NOTE: this code is only half the fix and cannot work alone. A host rule never
  // runs unless the request reaches Vercel in the first place, which requires
  // (1) an A record for techregardless.com -> 76.76.21.21 at Namecheap, and
  // (2) techregardless.com added as a domain on the Vercel project.
  // Adding an A record does NOT affect MX, so Workspace mail keeps working.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "techregardless.com" }],
        destination: "https://tech-regardless.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.techregardless.com" }],
        destination: "https://tech-regardless.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.tech-regardless.com" }],
        destination: "https://tech-regardless.com/:path*",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX();
export default withMDX(nextConfig);
