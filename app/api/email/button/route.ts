// PNG of an email call-to-action button. See lib/emails/images.tsx.
//   /api/email/button?label=See%20recent%20work
//   /api/email/button?label=Email&v=outline
import { isButtonLabel, type ButtonVariant } from "@/lib/emails/button-spec";
import { renderButton } from "@/lib/emails/images";

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const label = params.get("label") ?? "";
  const variant: ButtonVariant = params.get("v") === "outline" ? "outline" : "solid";
  if (!isButtonLabel(label, variant)) {
    return new Response("Unknown label", { status: 400 });
  }
  return renderButton(label, variant);
}
