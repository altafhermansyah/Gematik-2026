import type { Metadata } from "next";
import GlobalNotFoundView from "@/components/site/GlobalNotFoundView";
import { getAtlasCases } from "@/modules/atlas/queries";
import { idMessages } from "@/lib/i18n/messages";

export const metadata: Metadata = {
  title: idMessages.globalNotFound.metaTitle,
  description: idMessages.globalNotFound.metaDescription,
};

export default function GlobalNotFound() {
  const cases = getAtlasCases("id");
  const metricCount = cases.reduce(
    (sum, item) => sum + (item.metrics?.length ?? 0),
    0
  );

  return (
    <GlobalNotFoundView
      caseCount={cases.length}
      metricCount={metricCount}
    />
  );
}
