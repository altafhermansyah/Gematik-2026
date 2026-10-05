import { z } from "zod";
import { LocalizedTextSchema } from "@/lib/i18n/localized";

export const CaseMetricItemSchema = z.object({
  label: LocalizedTextSchema,
  value: z.number(),
  unit: z.string(),
});

export const CaseMetricsSchema = z.array(CaseMetricItemSchema);

export type CaseMetricRaw = z.infer<typeof CaseMetricItemSchema>;
