import { formatTechnologyTag } from "@/lib/format";

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
  return (
    <header>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] t-soft">
        <span
          className="swatch"
          style={{ backgroundColor: domain.color }}
          aria-hidden="true"
        />
        <span>{domain.name}</span>
        <span className="t-faint">
          {region ? `${region}, ${countryCode}` : countryCode}
        </span>
        {year && <span className="t-faint tnum">{year}</span>}
      </div>

      <h1 className="title mt-4 max-w-[26ch]">{title}</h1>

      <p className="lead mt-5 max-w-[58ch]">{summary}</p>

      {(sdgs.length > 0 || technologies.length > 0) && (
        <div className="mt-6 flex flex-wrap gap-1.5">
          {sdgs.map((sdg) => (
            <span key={`sdg-${sdg}`} className="chip tnum">
              SDG {sdg}
            </span>
          ))}
          {technologies.map((technology) => (
            <span key={`tech-${technology}`} className="chip">
              {formatTechnologyTag(technology)}
            </span>
          ))}
        </div>
      )}

      <div className="measure-rule mt-8" />
    </header>
  );
}
