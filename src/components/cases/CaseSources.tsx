import type { CaseSourceItem } from "@/modules/cases/types";
import { DEFAULT_LOCALE } from "@/lib/i18n/localized";
import { getMessages } from "@/lib/i18n/messages";

type CaseSourcesProps = {
  sources: CaseSourceItem[];
  title?: string;
  opensInNewTab?: string;
  accessedPrefix?: string;
};

function formatAccessDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch {
    return isoString;
  }
}

export default function CaseSources({
  sources,
  title,
  opensInNewTab,
  accessedPrefix,
}: CaseSourcesProps) {
  if (!sources || sources.length === 0) {
    return null;
  }

  const defaultMessages = getMessages(DEFAULT_LOCALE);
  const sectionTitle = title ?? defaultMessages.cases.sections.sources;
  const tabLabel = opensInNewTab ?? defaultMessages.common.opensInNewTab;
  const prefix = accessedPrefix ?? defaultMessages.cases.sources.accessedPrefix;

  return (
    <section className="space-y-4 pt-2 border-t border-slate-800">
      <h2 className="text-xl font-semibold tracking-tight text-slate-100">
        {sectionTitle}
      </h2>

      <ol className="list-decimal list-outside pl-5 space-y-3 text-sm text-slate-300">
        {sources.map((source, index) => (
          <li key={index} className="leading-relaxed pl-1">
            <div className="inline break-words [overflow-wrap:anywhere]">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-amber-400 hover:text-amber-300 underline underline-offset-4 decoration-amber-400/40 hover:decoration-amber-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
              >
                {source.title}
                <span className="sr-only"> {tabLabel}</span>
              </a>

              {(source.publisher || source.accessedAt) && (
                <span className="text-slate-400 ml-1.5 text-xs">
                  {source.publisher && <span>— {source.publisher}</span>}
                  {source.accessedAt && (
                    <span className="ml-1 text-slate-400">
                      ({prefix} {formatAccessDate(source.accessedAt)})
                    </span>
                  )}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
