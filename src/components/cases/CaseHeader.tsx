type CaseHeaderProps = {
  title: string;
  summary: string;
  countryCode: string;
  region: string | null;
  year: number | null;
  sdgs: number[];
  technologies: string[];
  domain: {
    slug: string;
    name: string;
    color: string;
  };
};

/**
 * Humanizes technology slugs (e.g., 'deep-learning' -> 'Deep learning', 'iot' -> 'IoT').
 */
function formatTechnologyTag(tag: string): string {
  const acronyms: Record<string, string> = {
    iot: "IoT",
    ai: "AI",
    ml: "ML",
    nlp: "NLP",
    llm: "LLM",
  };
  const lower = tag.toLowerCase();
  if (acronyms[lower]) {
    return acronyms[lower];
  }
  const spaced = tag.replace(/-/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export default function CaseHeader({
  title,
  summary,
  countryCode,
  region,
  year,
  sdgs,
  technologies,
  domain,
}: CaseHeaderProps) {
  const locationString = region ? `${region}, ${countryCode}` : countryCode;

  return (
    <header className="space-y-4 border-b border-slate-800 pb-8">
      {/* Domain badge with text + accessible color dot */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
          style={{ backgroundColor: domain.color }}
          aria-hidden="true"
        />
        <span className="font-medium text-slate-300">{domain.name}</span>
      </div>

      {/* Main Page Heading */}
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-50 break-words leading-tight">
        {title}
      </h1>

      {/* Metadata line: Location and year */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-400">
        <span>{locationString}</span>
        {year && (
          <>
            <span aria-hidden="true" className="text-slate-600">
              •
            </span>
            <span>{year}</span>
          </>
        )}
      </div>

      {/* Lede / summary paragraph */}
      <p className="text-lg leading-relaxed text-slate-300 break-words">
        {summary}
      </p>

      {/* Chips: SDGs and Technologies */}
      {(sdgs.length > 0 || technologies.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {sdgs.map((sdg) => (
            <span
              key={`sdg-${sdg}`}
              className="inline-flex items-center rounded-md border border-slate-700/80 bg-slate-800/60 px-2.5 py-1 text-xs font-medium text-slate-300"
            >
              SDG {sdg}
            </span>
          ))}

          {technologies.map((tech) => (
            <span
              key={`tech-${tech}`}
              className="inline-flex items-center rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-300"
            >
              {formatTechnologyTag(tech)}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
