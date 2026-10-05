import type { CaseMetric } from "@/modules/cases/types";
import { DEFAULT_LOCALE } from "@/lib/i18n/localized";
import { getMessages } from "@/lib/i18n/messages";

type CaseMetricsProps = {
  metrics: CaseMetric[];
  title?: string;
};

export default function CaseMetrics({ metrics, title }: CaseMetricsProps) {
  if (!metrics || metrics.length === 0) {
    return null;
  }

  const sectionTitle =
    title ?? getMessages(DEFAULT_LOCALE).cases.sections.metrics;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight text-slate-100">
        {sectionTitle}
      </h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 space-y-1"
          >
            <dt className="text-sm font-medium text-slate-400">
              {metric.label}
            </dt>
            <dd className="text-2xl font-bold tracking-tight text-slate-100 flex items-baseline gap-1.5 break-words">
              <span>{metric.value.toLocaleString(DEFAULT_LOCALE)}</span>
              {metric.unit && (
                <span className="text-sm font-normal text-slate-400">
                  {metric.unit}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
