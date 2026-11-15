import { generateLlmsTxt } from "@/lib/seo/llms";
import { getSiteOrigin } from "@/lib/seo/metadata";

export const dynamic = "force-static";

export function GET() {
  const body = generateLlmsTxt(getSiteOrigin());

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
