import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { preload } from "react-dom";
import Link from "next/link";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import CosmosViewport from "@/components/home/CosmosViewport";
import InteractiveTelemetryShowcase, {
  type TelemetryDomainRow,
  type TelemetryIndonesiaItem,
  type TelemetrySdgRow,
} from "@/components/home/InteractiveTelemetryShowcase";
import { getAtlasCases, getAtlasDomains } from "@/modules/atlas/queries";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/localized";
import { formatTemplate, getMessages } from "@/lib/i18n/messages";
import { localeHref } from "@/lib/i18n/urls";

type HomeProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function readLocale(value: string | string[] | undefined): Locale {
  return value === "en" ? "en" : DEFAULT_LOCALE;
}

export async function generateMetadata({
  searchParams,
}: HomeProps): Promise<Metadata> {
  const resolved = await searchParams;
  const t = getMessages(readLocale(resolved.lang));
  return {
    title: t.home.meta.title,
    description: t.home.meta.description,
  };
}

const VERIFIED_FIELD_PARTNERS = [
  {
    name: "KKI Warsi Sumatra",
    slug: "rainforest-connection-forest-listening",
  },
  {
    name: "UGM Wolbachia",
    slug: "wmp-wolbachia-dengue-yogyakarta",
  },
  {
    name: "PetaBencana.id",
    slug: "petabencana-flood-crowdsourcing",
  },
  {
    name: "PlantVillage Nuru",
    slug: "plantvillage-nuru-crop-disease",
  },
  {
    name: "Zipline Rwanda",
    slug: "zipline-medical-drone-delivery",
  },
  {
    name: "AlphaFold EMBL-EBI",
    slug: "alphafold-protein-structure-prediction",
  },
] as const;

function DomainIcon({ slug, color }: { slug: string; color: string }): ReactNode {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.65,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (slug) {
    case "climate":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3.6 9h16.8M3.6 15h16.8" />
          <path d="M12 3a14.5 14.5 0 0 0 0 18 14.5 14.5 0 0 0 0-18Z" />
        </svg>
      );
    case "food":
      return (
        <svg {...common}>
          <path d="M12 21V9" />
          <path d="M12 13c-4 0-6.5-2.5-6.5-6.5C9.5 6.5 12 9 12 13Z" />
          <path d="M12 10c4 0 6.5-2.5 6.5-6.5C14.5 3.5 12 6 12 10Z" />
        </svg>
      );
    case "health":
      return (
        <svg {...common}>
          <path d="M3 12h4l2.2-5 3.6 10 2.2-5H21" />
        </svg>
      );
    case "education":
      return (
        <svg {...common}>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z" />
          <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v17h5.5a2.5 2.5 0 0 1 2.5 2V5.5Z" />
        </svg>
      );
    case "disaster":
      return (
        <svg {...common}>
          <path d="M12 3l8 14a1.5 1.5 0 0 1-1.3 2.25H5.3A1.5 1.5 0 0 1 4 17L12 3Z" />
          <path d="M12 9.5v4" />
          <circle cx="12" cy="16" r="0.6" fill={color} />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="9" cy="8.5" r="3" />
          <circle cx="16.5" cy="9.5" r="2.25" />
          <path d="M3.5 19.5a5.5 5.5 0 0 1 11 0" />
          <path d="M15 19.5a4 4 0 0 1 5.5-3.6" />
        </svg>
      );
  }
}

export default async function Home({ searchParams }: HomeProps) {
  const resolved = await searchParams;
  const locale = readLocale(resolved.lang);
  const t = getMessages(locale);

  const cases = getAtlasCases(locale);
  const domains = getAtlasDomains(locale);

  const countriesCount = new Set(cases.map((c) => c.countryCode)).size;
  const metricsCount = cases.reduce(
    (total, c) => total + (c.metrics?.length ?? 0),
    0
  );

  // Domain telemetry breakdown & sorted SDG sets derived verbatim from src/content/
  const domainSdgs = new Map<string, number[]>();
  const domainTelemetry: TelemetryDomainRow[] = domains.map((domain) => {
    const domainCases = cases.filter((c) => c.domain.slug === domain.slug);
    const domainMetrics = domainCases.reduce(
      (sum, c) => sum + (c.metrics?.length ?? 0),
      0
    );
    domainSdgs.set(
      domain.slug,
      [...new Set(domainCases.flatMap((c) => c.sdgs ?? []))].sort(
        (a, b) => a - b
      )
    );
    return {
      slug: domain.slug,
      name: domain.name,
      color: domain.color,
      caseCount: domainCases.length,
      metricCount: domainMetrics,
    };
  });

  // UN SDG coverage derived directly from published cases
  const sdgCounter = new Map<
    number,
    { caseCount: number; primaryDomainSlug: string }
  >();
  for (const caseStudy of cases) {
    for (const sdg of caseStudy.sdgs ?? []) {
      const existing = sdgCounter.get(sdg);
      if (existing) {
        existing.caseCount += 1;
      } else {
        sdgCounter.set(sdg, {
          caseCount: 1,
          primaryDomainSlug: caseStudy.domain.slug,
        });
      }
    }
  }
  const sdgCoverage: TelemetrySdgRow[] = [...sdgCounter.entries()]
    .map(([sdg, data]) => ({
      sdg,
      caseCount: data.caseCount,
      primaryDomainSlug: data.primaryDomainSlug,
    }))
    .sort((a, b) => b.caseCount - a.caseCount || a.sdg - b.sdg);

  const uniqueSdgsCount = sdgCoverage.length;

  const indonesiaCases: TelemetryIndonesiaItem[] = cases
    .filter((c) => c.countryCode === "ID")
    .map((c) => {
      const leadMetric = c.metrics?.[0];
      return {
        slug: c.slug,
        title: c.title,
        region: c.region ?? "Indonesia",
        year: c.year ?? null,
        domainColor: c.domain.color,
        domainName: c.domain.name,
        metricValue: leadMetric ? leadMetric.value : null,
        metricUnit: leadMetric ? leadMetric.unit : "",
        metricLabel: leadMetric ? leadMetric.label : "",
      };
    });

  const casePoints = cases.map((c) => ({
    slug: c.slug,
    lat: c.lat,
    lng: c.lng,
    color: c.domain.color,
  }));

  preload("/globe/planet.glb", {
    as: "fetch",
    crossOrigin: "anonymous",
    fetchPriority: "high",
  });
  preload("/globe/planet-lights.webp", {
    as: "image",
    type: "image/webp",
    crossOrigin: "anonymous",
    fetchPriority: "high",
  });

  return (
    <CosmosViewport casePoints={casePoints}>
      <SiteHeader locale={locale} variant="cosmos" labels={t.nav} />

      <main id="main" tabIndex={-1} className="cosmos-main">
        {/* Section 1: Hero + Verified Field Deployments */}
        <section className="cosmos-hero">
          <div className="cosmos-hero-inner">
            <p className="cosmos-eyebrow cosmos-hero-eyebrow">
              {t.home.hero.eyebrow}
            </p>

            <h1 className="cosmos-hero-title">
              {t.home.hero.titleLead}
              <br />
              <em className="cosmos-hero-em">{t.home.hero.titleAccent}</em>
            </h1>

            <p className="cosmos-hero-sub">
              {t.home.hero.lede}
            </p>

            <div className="cosmos-hero-actions">
              <Link
                href={localeHref("/atlas", locale)}
                className="cosmos-btn-primary"
              >
                <span>{t.home.hero.primaryCta}</span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3.5 8h9m0 0L8.8 4.3M12.5 8l-3.7 3.7"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <Link
                href={localeHref("/atlas?country=ID", locale)}
                className="cosmos-btn-outline"
              >
                {t.home.hero.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="cosmos-logos">
            <p className="cosmos-logos-label">{t.home.hero.deploymentsLabel}</p>
            <div className="cosmos-logos-row">
              {VERIFIED_FIELD_PARTNERS.map((partner) => (
                <Link
                  key={partner.slug}
                  href={localeHref(`/cases/${partner.slug}`, locale)}
                  className="cosmos-partner-link"
                >
                  {partner.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: 6 Impact Domains x UN SDGs */}
        <section id="domains" className="cosmos-section">
          <div className="cosmos-section-head">
            <p
              className="cosmos-eyebrow"
              data-reveal
              style={{ "--rd": "40ms" } as CSSProperties}
            >
              {t.home.domains.eyebrow}
            </p>
            <h2
              className="cosmos-h2"
              data-reveal
              style={{ "--rd": "120ms" } as CSSProperties}
            >
              {t.home.domains.title}
            </h2>
            <p
              className="cosmos-section-sub"
              data-reveal
              style={{ "--rd": "200ms" } as CSSProperties}
            >
              {t.home.domains.description}
            </p>
          </div>

          <div className="cosmos-feature-grid">
            {domainTelemetry.map((domain, index) => (
              <Link
                key={domain.slug}
                href={localeHref(`/atlas?domain=${domain.slug}`, locale)}
                className="cosmos-card"
                data-reveal
                style={
                  {
                    "--rd": `${(index % 3) * 90 + 120}ms`,
                    "--card-accent": domain.color,
                  } as CSSProperties
                }
              >
                <span className="cosmos-folder-back" aria-hidden="true">
                  <span className="cosmos-folder-tab">
                    <span
                      className="cosmos-folder-dot"
                      style={{ backgroundColor: domain.color }}
                    />
                    <span className="cosmos-folder-code tnum">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <span className="cosmos-folder-rear" />
                </span>

                <span className="cosmos-folder-sheets" aria-hidden="true">
                  <span className="cosmos-folder-sheet cosmos-folder-sheet--back">
                    <span className="cosmos-sheet-rule" />
                  </span>
                  <span className="cosmos-folder-sheet cosmos-folder-sheet--front">
                    <span
                      className="cosmos-sheet-stripe"
                      style={{ backgroundColor: domain.color }}
                    />
                    <span className="cosmos-sheet-rule" />
                    <span className="cosmos-sheet-rule cosmos-sheet-rule--short" />
                  </span>
                </span>

                <span className="cosmos-folder-front">
                  <span className="cosmos-card-top">
                    <span className="cosmos-card-icon">
                      <DomainIcon slug={domain.slug} color={domain.color} />
                    </span>
                    <span className="cosmos-card-count tnum">
                      {formatTemplate(t.home.domains.caseCountTemplate, {
                        count: domain.caseCount,
                      })}
                    </span>
                  </span>

                  <h3 className="cosmos-card-title">{domain.name}</h3>
                  <p className="cosmos-card-desc">
                    {t.home.domains.summaries[domain.slug]}
                  </p>

                  <span className="cosmos-card-foot">
                    <span className="cosmos-sdg-tag tnum">
                      {t.home.domains.sdgPrefix}{" "}
                      {(domainSdgs.get(domain.slug) ?? []).join(", ")}
                    </span>
                    <span className="cosmos-card-arrow" aria-hidden="true">
                      →
                    </span>
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 3: Audited Telemetry Showcase & 4 Real Stats */}
        <section id="sdg-showcase" className="cosmos-section">
          <div className="cosmos-showcase-grid">
            <div className="cosmos-showcase-copy">
              <p
                className="cosmos-eyebrow"
                data-reveal
                style={{ "--rd": "40ms" } as CSSProperties}
              >
                {t.home.showcase.eyebrow}
              </p>
              <h2
                className="cosmos-h2"
                data-reveal
                style={{ "--rd": "120ms" } as CSSProperties}
              >
                {t.home.showcase.title}
              </h2>
              <p
                className="cosmos-showcase-desc"
                data-reveal
                style={{ "--rd": "200ms" } as CSSProperties}
              >
                {t.home.showcase.description}
              </p>
              <div
                data-reveal
                style={{ "--rd": "280ms" } as CSSProperties}
              >
                <Link
                  href={localeHref("/atlas", locale)}
                  className="cosmos-btn-primary"
                >
                  <span>{t.home.showcase.cta}</span>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3.5 8h9m0 0L8.8 4.3M12.5 8l-3.7 3.7"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <InteractiveTelemetryShowcase
              locale={locale}
              labels={t.home.showcase}
              domains={domainTelemetry}
              sdgCoverage={sdgCoverage}
              indonesiaCases={indonesiaCases}
              totalCases={cases.length}
              totalMetrics={metricsCount}
            />
          </div>

          <div
            className="cosmos-stats"
            data-reveal
            style={{ "--rd": "160ms" } as CSSProperties}
          >
            <div className="cosmos-stat">
              <span className="cosmos-stat-n tnum">{cases.length}</span>
              <span className="cosmos-stat-l">{t.home.stats.casesLabel}</span>
            </div>
            <div className="cosmos-stat">
              <span className="cosmos-stat-n cosmos-stat-n-ink tnum">
                {countriesCount}
              </span>
              <span className="cosmos-stat-l">{t.home.stats.countriesLabel}</span>
            </div>
            <div className="cosmos-stat">
              <span className="cosmos-stat-n tnum">{metricsCount}</span>
              <span className="cosmos-stat-l">{t.home.stats.metricsLabel}</span>
            </div>
            <div className="cosmos-stat">
              <span className="cosmos-stat-n cosmos-stat-n-ink tnum">
                {uniqueSdgsCount}
              </span>
              <span className="cosmos-stat-l">{t.home.stats.sdgsLabel}</span>
            </div>
          </div>
        </section>

        {/* Section 4: Closing CTA */}
        <section id="cta" className="cosmos-section cosmos-section-cta">
          <div
            className="cosmos-cta-card"
            data-reveal
            style={{ "--rd": "100ms" } as CSSProperties}
          >
            <p className="cosmos-eyebrow">{t.home.closing.eyebrow}</p>
            <h2 className="cosmos-h2 cosmos-cta-title">{t.home.closing.title}</h2>
            <p className="cosmos-cta-sub">{t.home.closing.description}</p>
            <div className="cosmos-cta-actions">
              <Link
                href={localeHref("/atlas", locale)}
                className="cosmos-btn-primary"
              >
                <span>{t.home.closing.primaryCta}</span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3.5 8h9m0 0L8.8 4.3M12.5 8l-3.7 3.7"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link
                href={localeHref("/atlas?country=ID", locale)}
                className="cosmos-btn-outline"
              >
                {t.home.closing.secondaryCta}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter
        locale={locale}
        variant="cosmos"
        labels={t.footer}
        caseCount={cases.length}
        metricCount={metricsCount}
      />
    </CosmosViewport>
  );
}
