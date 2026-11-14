import type { CSSProperties } from "react";
import type { CaseSourceItem } from "@/modules/cases/types";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/localized";

type CaseSourcesProps = {
  id: string;
  index: string;
  title: string;
  sources: CaseSourceItem[];
  opensInNewTab: string;
  accessedPrefix: string;
  locale?: Locale;
};

function formatAccessDate(isoString: string, locale: Locale): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export default function CaseSources({
  id,
  index,
  title,
  sources,
  opensInNewTab,
  accessedPrefix,
  locale = DEFAULT_LOCALE,
}: CaseSourcesProps) {
  if (sources.length === 0) return null;

  return (
    <section id={id} className="scroll-mt-8 mt-14 border-t hairline-strong pt-5">
      <div className="flex items-baseline gap-3">
        <span className="num micro t-faint tnum">{index}</span>
        <h2 className="section-title text-[1.5rem]">{title}</h2>
      </div>

      <ol className="mt-4">
        {sources.map((source, sourceIndex) => (
          <li
            key={`${source.url}-${sourceIndex}`}
            className="stagger-row grid grid-cols-[2rem_minmax(0,1fr)] gap-2 border-b hairline py-3"
            style={{ "--row-i": sourceIndex } as CSSProperties}
          >
            <span className="num micro t-faint tnum">
              {String(sourceIndex + 1).padStart(2, "0")}
            </span>
            <div>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="draw inline-flex min-h-[28px] items-center font-medium [overflow-wrap:anywhere]"
              >
                {source.title}
                <span className="sr-only"> {opensInNewTab}</span>
              </a>
              <p className="micro t-soft mt-1">
                {[
                  source.publisher,
                  source.accessedAt
                    ? `${accessedPrefix} ${formatAccessDate(source.accessedAt, locale)}`
                    : null,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
