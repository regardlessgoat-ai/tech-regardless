// Write the static email images to public/. Re-run after changing the badge.
//   npx tsx scripts/email-assets.tsx
import { writeFileSync } from "node:fs";
import { renderBadge } from "../lib/emails/images";

async function main() {
  const png = Buffer.from(await (await renderBadge()).arrayBuffer());
  writeFileSync("public/brand/email-badge.png", png);
  console.log(`wrote public/brand/email-badge.png (${png.length} bytes)`);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
