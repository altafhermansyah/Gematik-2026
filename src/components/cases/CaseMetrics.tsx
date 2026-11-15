import type { CSSProperties } from "react";
import type { CaseMetric } from "@/modules/cases/types";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/localized";
import { formatMetricValue } from "@/lib/format";

type CaseMetricsProps = {
  id: string;
  index: string;
  title: string;
  metrics: CaseMetric[];
  accentColor: string;
  sourceQuotePrefix: string;
  opensInNewTab: string;
  locale?: Locale;
};

export default function CaseMetrics({
  id,
  index,
  title,
  metrics,
  accentColor,
  sourceQuotePrefix,
  opensInNewTab,
  locale = DEFAULT_LOCALE,
}: CaseMetricsProps) {
  if (metrics.length === 0) return null;

  return (
    <section id={id} className="scroll-mt-8 mt-12">
      <div className="flex items-baseline justify-between gap-3 border-b hairline-strong pb-2">
        <div className="flex items-baseline gap-3">
          <span className="num micro t-faint tnum">{index}</span>
          <h2 className="section-title text-[1.5rem]">{title}</h2>
        </div>
        <span className="micro t-faint tnum">{metrics.length}</span>
      </div>

      <ul>
        {metrics.map((metric, metricIndex) => (
          <li
            className="evidence stagger-row"
            key={metricIndex}
            style={{ "--row-i": metricIndex } as CSSProperties}
          >
            <p className="evidence-value">
              {formatMetricValue(metric.value, locale)}
              {metric.unit && (
                <span className="mt-1 block text-[0.8125rem] font-normal leading-snug tracking-normal text-[var(--ink-soft)]">
                  {metric.unit}
                </span>
              )}
            </p>

            <div>
              <p className="text-[0.9375rem] font-medium">{metric.label}</p>

              {metric.quote && (
                <blockquote
                  className="evidence-quote mt-3"
                  style={{ borderLeftColor: accentColor }}
                  cite={metric.sourceUrl}
                >
                  &ldquo;{metric.quote}&rdquo;
                </blockquote>
              )}

              {metric.sourceUrl && (
                <a
                  href={metric.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="draw micro t-soft mt-2 inline-flex min-h-[28px] items-center py-1"
                >
                  {sourceQuotePrefix}
                  <span className="sr-only">
                    {": "}
                    {metric.label} {opensInNewTab}
                  </span>
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
