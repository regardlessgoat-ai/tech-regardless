// PNG of an email call-to-action button. See lib/emails/images.tsx.
//   /api/email/button?label=See%20recent%20work
import { isButtonLabel } from "@/lib/emails/button-spec";
import { renderButton } from "@/lib/emails/images";

export async function GET(req: Request) {
  const label = new URL(req.url).searchParams.get("label") ?? "";
  if (!isButtonLabel(label)) {
    return new Response("Unknown label", { status: 400 });
  }
  return renderButton(label);
}
