import { ImageResponse } from "next/og";
import { resolveLocalized } from "@/lib/i18n/localized";
import { getCaseBySlug } from "@/modules/cases/queries";
import { getDomains, getPublishedCases } from "@/modules/content/store";
import { getSiteOrigin, OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "./metadata";

export const OG_SIZE = {
  width: OG_IMAGE_WIDTH,
  height: OG_IMAGE_HEIGHT,
};
export const OG_CONTENT_TYPE = "image/png";

function truncateCopy(text: string, maxLength: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  const slice = clean.slice(0, maxLength - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cut =
    lastSpace >= Math.floor(maxLength * 0.55) ? slice.slice(0, lastSpace) : slice;
  return `${cut.replace(/[\s,;:\-\u2013\u2014]+$/u, "")}…`;
}

function getMetricValueFontSize(value: string): number {
  const len = value.trim().length;
  if (len <= 4) return 72;
  if (len <= 7) return 58;
  if (len <= 11) return 46;
  return 38;
}

function getTitleFontSize(title: string): number {
  const len = title.length;
  if (len <= 32) return 46;
  if (len <= 52) return 40;
  return 34;
}

function getHostnameLabel(origin: string): string {
  try {
    return new URL(origin).host;
  } catch {
    return "karsaloka.vercel.app";
  }
}

export function renderPlatformOgCard(): ImageResponse {
  const cases = getPublishedCases();
  const domains = getDomains();
  const countryCount = new Set(cases.map((item) => item.countryCode)).size;
  const metricCount = cases.reduce((sum, item) => sum + item.metrics.length, 0);
  const sdgCount = new Set(cases.flatMap((item) => item.sdgs)).size;
  const hostLabel = getHostnameLabel(getSiteOrigin());

  const telemetryTiles = [
    { number: String(cases.length), label: "Studi Kasus" },
    { number: String(countryCount), label: "Negara" },
    { number: String(metricCount), label: "Metrik Dampak" },
    { number: String(sdgCount), label: "UN SDGs" },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 72px",
          background:
            "radial-gradient(circle at 82% 18%, rgba(93, 240, 168, 0.20) 0%, rgba(11, 20, 40, 0.96) 44%, #040914 100%)",
          backgroundColor: "#040914",
          color: "#edf2ff",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Observatory Identity Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "9999px",
                backgroundColor: "#5df0a8",
                boxShadow: "0 0 18px rgba(93, 240, 168, 0.65)",
                display: "flex",
              }}
            />
            <div
              style={{
                display: "flex",
                fontSize: "20px",
                letterSpacing: "0.14em",
                color: "#f3f6ff",
              }}
            >
              KARSALOKA · OBSERVATORY
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 18px",
              borderRadius: "9999px",
              border: "1px solid rgba(93, 240, 168, 0.35)",
              backgroundColor: "rgba(93, 240, 168, 0.10)",
              color: "#5df0a8",
              fontSize: "15px",
              letterSpacing: "0.08em",
            }}
          >
            TERVERIFIKASI SUMBER PRIMER
          </div>
        </div>

        {/* Central Safe-Zone Hero */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              maxWidth: "960px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: "48px",
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
                color: "#f3f6ff",
              }}
            >
              Atlas inovasi AI &amp; teknologi yang sudah bekerja di lapangan.
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "22px",
                lineHeight: 1.4,
                color: "#b8c4de",
              }}
            >
              Setiap klaim dampak dikutip langsung dari studi peer-reviewed, laporan
              resmi, dan dokumentasi terbuka lintas enam bidang global.
            </div>
          </div>

          {/* Telemetry Row */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "18px",
              width: "100%",
            }}
          >
            {telemetryTiles.map((tile) => (
              <div
                key={tile.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  padding: "18px 22px",
                  borderRadius: "16px",
                  backgroundColor: "rgba(14, 24, 48, 0.85)",
                  border: "1px solid rgba(237, 242, 255, 0.14)",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: "40px",
                    lineHeight: 1,
                    color: "#5df0a8",
                  }}
                >
                  {tile.number}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: "16px",
                    color: "#c8d3ea",
                  }}
                >
                  {tile.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            borderTop: "1px solid rgba(237, 242, 255, 0.12)",
            paddingTop: "18px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            {domains.map((domain) => (
              <div
                key={domain.slug}
                style={{ display: "flex", alignItems: "center", gap: "7px" }}
              >
                <div
                  style={{
                    width: "9px",
                    height: "9px",
                    borderRadius: "9999px",
                    backgroundColor: domain.color,
                    display: "flex",
                  }}
                />
                <div style={{ display: "flex", fontSize: "15px", color: "#9aa8c7" }}>
                  {resolveLocalized(domain.name, `${domain.slug}.name`, "id")}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", fontSize: "16px", color: "#9aa8c7" }}>
            {hostLabel}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
    }
  );
}

export function renderCaseOgCard(slug: string): ImageResponse {
  const caseDetail = getCaseBySlug(slug, "id");
  if (!caseDetail) {
    return renderPlatformOgCard();
  }

  const hostLabel = getHostnameLabel(getSiteOrigin());
  const accentColor = caseDetail.domain.color || "#5df0a8";
  const primaryMetric = caseDetail.metrics[0] ?? {
    label: "Sumber Primer Terverifikasi",
    value: caseDetail.sources.length,
    unit: "referensi",
    quote: "",
    sourceUrl: "",
  };
  const isPercentMetric = primaryMetric.unit.trim() === "%";
  const metricValueText = isPercentMetric
    ? `${primaryMetric.value}%`
    : String(primaryMetric.value);
  const metricUnitText = isPercentMetric ? null : primaryMetric.unit.trim();
  const locationParts = [caseDetail.region, caseDetail.countryCode]
    .filter(Boolean)
    .join(", ");
  const metaLine = caseDetail.year
    ? `${locationParts} · ${caseDetail.year}`
    : locationParts;
  const safeTitle = truncateCopy(caseDetail.title, 92);
  const safeSummary = truncateCopy(caseDetail.summary, 140);
  const safeMetricLabel = truncateCopy(primaryMetric.label, 68);
  const sdgBadges = caseDetail.sdgs.slice(0, 3);
  const extraSdgs = Math.max(0, caseDetail.sdgs.length - sdgBadges.length);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "54px 68px",
          background: `radial-gradient(circle at 86% 24%, ${accentColor}30 0%, rgba(11, 20, 40, 0.96) 46%, #040914 100%)`,
          backgroundColor: "#040914",
          color: "#edf2ff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Metadata Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "7px 16px",
                borderRadius: "9999px",
                backgroundColor: "rgba(14, 24, 48, 0.9)",
                border: `1px solid ${accentColor}70`,
                fontSize: "16px",
                color: accentColor,
              }}
            >
              <div
                style={{
                  width: "9px",
                  height: "9px",
                  borderRadius: "9999px",
                  backgroundColor: accentColor,
                  display: "flex",
                }}
              />
              <div style={{ display: "flex" }}>{caseDetail.domain.name}</div>
            </div>

            <div style={{ display: "flex", fontSize: "17px", color: "#b8c4de" }}>
              {metaLine}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {sdgBadges.map((sdg) => (
              <div
                key={sdg}
                style={{
                  display: "flex",
                  padding: "6px 12px",
                  borderRadius: "9999px",
                  border: "1px solid rgba(237, 242, 255, 0.22)",
                  backgroundColor: "rgba(237, 242, 255, 0.06)",
                  fontSize: "14px",
                  color: "#dbe5fb",
                }}
              >
                {`SDG ${sdg}`}
              </div>
            ))}
            {extraSdgs > 0 ? (
              <div
                style={{
                  display: "flex",
                  padding: "6px 12px",
                  borderRadius: "9999px",
                  border: "1px solid rgba(237, 242, 255, 0.22)",
                  fontSize: "14px",
                  color: "#9aa8c7",
                }}
              >
                {`+${extraSdgs}`}
              </div>
            ) : null}
          </div>
        </div>

        {/* Center Split Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "stretch",
            gap: "36px",
            width: "100%",
          }}
        >
          {/* Left Narrative Column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "16px",
              flex: 1,
              maxWidth: "635px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: "14px",
                letterSpacing: "0.14em",
                color: accentColor,
              }}
            >
              KARSALOKA · STUDI KASUS LAPANGAN
            </div>

            <div
              style={{
                display: "flex",
                fontSize: `${getTitleFontSize(safeTitle)}px`,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: "#f3f6ff",
              }}
            >
              {safeTitle}
            </div>

            <div
              style={{
                display: "flex",
                fontSize: "20px",
                lineHeight: 1.4,
                color: "#b8c4de",
              }}
            >
              {safeSummary}
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {caseDetail.technologies.slice(0, 3).map((tech) => (
                <div
                  key={tech}
                  style={{
                    display: "flex",
                    padding: "5px 12px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(237, 242, 255, 0.08)",
                    border: "1px solid rgba(237, 242, 255, 0.14)",
                    fontSize: "14px",
                    color: "#d4dff7",
                  }}
                >
                  {truncateCopy(tech, 24)}
                </div>
              ))}
            </div>
          </div>

          {/* Right Impact Telemetry Card */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "375px",
              padding: "28px 30px",
              borderRadius: "20px",
              backgroundColor: "rgba(11, 20, 40, 0.90)",
              border: `1px solid ${accentColor}55`,
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.45)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div
                style={{
                  display: "flex",
                  fontSize: "13px",
                  letterSpacing: "0.14em",
                  color: "#9aa8c7",
                }}
              >
                METRIK DAMPAK UTAMA
              </div>

              <div
                style={{
                  display: "flex",
                  fontSize: `${getMetricValueFontSize(metricValueText)}px`,
                  lineHeight: 1.02,
                  color: accentColor,
                }}
              >
                {metricValueText}
              </div>

              {metricUnitText ? (
                <div
                  style={{
                    display: "flex",
                    fontSize: "18px",
                    lineHeight: 1.25,
                    color: "#f3f6ff",
                  }}
                >
                  {truncateCopy(metricUnitText, 42)}
                </div>
              ) : null}

              <div
                style={{
                  display: "flex",
                  fontSize: "16px",
                  lineHeight: 1.35,
                  color: "#b8c4de",
                }}
              >
                {safeMetricLabel}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid rgba(237, 242, 255, 0.14)",
                paddingTop: "14px",
                fontSize: "14px",
                color: "#a7b5d1",
              }}
            >
              <div style={{ display: "flex" }}>
                {`${caseDetail.metrics.length} Metrik`}
              </div>
              <div style={{ display: "flex" }}>
                {`${caseDetail.sources.length} Sumber Primer`}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            borderTop: "1px solid rgba(237, 242, 255, 0.12)",
            paddingTop: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "9999px",
                backgroundColor: "#5df0a8",
                display: "flex",
              }}
            />
            <div style={{ display: "flex", fontSize: "16px", color: "#edf2ff" }}>
              KarsaLoka Observatory
            </div>
          </div>

          <div style={{ display: "flex", fontSize: "15px", color: "#9aa8c7" }}>
            {truncateCopy(`${hostLabel}/cases/${caseDetail.slug}`, 58)}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
    }
  );
}
