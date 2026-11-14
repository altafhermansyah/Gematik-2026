"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/localized";
import type { Messages } from "@/lib/i18n/messages";
import { formatMetricValue } from "@/lib/format";
import { localeHref } from "@/lib/i18n/urls";
import { useSharedIndicator } from "@/lib/motion/useSharedIndicator";

export type TelemetryDomainRow = {
  slug: string;
  name: string;
  color: string;
  caseCount: number;
  metricCount: number;
};

export type TelemetrySdgRow = {
  sdg: number;
  caseCount: number;
  primaryDomainSlug: string;
};

export type TelemetryIndonesiaItem = {
  slug: string;
  title: string;
  region: string;
  year: number | null;
  domainColor: string;
  domainName: string;
  metricValue: number | null;
  metricUnit: string;
  metricLabel: string;
};

type InteractiveTelemetryShowcaseProps = {
  locale: Locale;
  labels: Messages["home"]["showcase"];
  domains: readonly TelemetryDomainRow[];
  sdgCoverage: readonly TelemetrySdgRow[];
  indonesiaCases: readonly TelemetryIndonesiaItem[];
  totalCases: number;
  totalMetrics: number;
};

type TabKey = "domains" | "sdgs" | "indonesia";

export default function InteractiveTelemetryShowcase({
  locale,
  labels,
  domains,
  sdgCoverage,
  indonesiaCases,
  totalCases,
  totalMetrics,
}: InteractiveTelemetryShowcaseProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("domains");
  const tabRefs = useRef<Record<TabKey, HTMLButtonElement | null>>({
    domains: null,
    sdgs: null,
    indonesia: null,
  });
  const { containerRef: tablistRef, indicatorRef: tabIndicatorRef } =
    useSharedIndicator<HTMLDivElement>({
      activeKey: activeTab,
      orientation: "horizontal",
    });

  const tabs: { key: TabKey; label: string }[] = [
    { key: "domains", label: labels.tabs.domains },
    { key: "sdgs", label: labels.tabs.sdgs },
    { key: "indonesia", label: labels.tabs.indonesia },
  ];

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    let nextIndex = index;
    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextTab = tabs[nextIndex].key;
    setActiveTab(nextTab);
    tabRefs.current[nextTab]?.focus();
  };

  const maxDomainMetrics = Math.max(1, ...domains.map((d) => d.metricCount));
  const sortedDomainsByMetrics = [...domains]
    .sort((a, b) => b.metricCount - a.metricCount)
    .slice(0, 4);

  const maxSdgCases = Math.max(1, ...sdgCoverage.map((s) => s.caseCount));
  const topSdgs = sdgCoverage.slice(0, 6);

  return (
    <div className="cosmos-dash" data-reveal style={{ "--rd": "160ms" } as React.CSSProperties}>
      <div className="cosmos-dash-head">
        <span className="cosmos-dash-title">{labels.cardTitle}</span>
      </div>

      <div
        ref={tablistRef}
        role="tablist"
        aria-label={labels.tabsAria}
        className="cosmos-tablist"
      >
        <span
          ref={tabIndicatorRef}
          className="cosmos-tab-indicator"
          aria-hidden="true"
        />
        {tabs.map((tab, idx) => {
          const isSelected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              ref={(el) => {
                tabRefs.current[tab.key] = el;
              }}
              type="button"
              role="tab"
              id={`telemetry-tab-${tab.key}`}
              data-indicator-key={tab.key}
              aria-selected={isSelected}
              aria-controls={`telemetry-panel-${tab.key}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setActiveTab(tab.key)}
              onKeyDown={(e) => handleTabKeyDown(e, idx)}
              className="cosmos-tab"
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Per Domain */}
      <div
        role="tabpanel"
        id="telemetry-panel-domains"
        aria-labelledby="telemetry-tab-domains"
        hidden={activeTab !== "domains"}
      >
        <div className="cosmos-panel-inner cosmos-panel-animate">
          <div className="cosmos-bars" aria-label={labels.tabs.domains}>
            {domains.map((domain, index) => {
              const heightPct = Math.max(
                18,
                Math.round((domain.metricCount / maxDomainMetrics) * 100)
              );
              return (
                <div key={domain.slug} className="cosmos-bar-col">
                  <span className="cosmos-bar-val tnum">{domain.metricCount}</span>
                  <span
                    className="cosmos-bar"
                    style={
                      {
                        "--h": `${heightPct}%`,
                        "--d": `${index * 30}ms`,
                        "--bar-color": domain.color,
                      } as CSSProperties
                    }
                    title={`${domain.name}: ${domain.metricCount}`}
                  />
                  <span className="cosmos-bar-label" title={domain.name}>
                    {domain.name.split(" ")[0]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="cosmos-rows">
            {sortedDomainsByMetrics.map((domain, index) => {
              const share =
                totalMetrics > 0
                  ? Math.round((domain.metricCount / totalMetrics) * 100)
                  : 0;
              return (
                <Link
                  key={domain.slug}
                  href={localeHref(`/atlas?domain=${domain.slug}`, locale)}
                  className="cosmos-dash-row cosmos-dash-row-link stagger-row"
                  style={{ "--row-i": index } as CSSProperties}
                >
                  <span className="cosmos-row-name">
                    <span
                      className="cosmos-row-dot"
                      style={{ backgroundColor: domain.color }}
                      aria-hidden="true"
                    />
                    <span className="truncate">{domain.name}</span>
                  </span>
                  <span className="cosmos-track" aria-hidden="true">
                    <span
                      className="cosmos-fill"
                      style={
                        {
                          "--w": `${share}%`,
                          "--d": `${index * 30 + 60}ms`,
                          "--fill-color": domain.color,
                        } as CSSProperties
                      }
                    />
                  </span>
                  <span className="cosmos-row-val tnum">{share}%</span>
                </Link>
              );
            })}
          </div>
          <p className="cosmos-dash-foot">{labels.domainFootnote}</p>
        </div>
      </div>

      {/* Tab 2: UN SDG Targets */}
      <div
        role="tabpanel"
        id="telemetry-panel-sdgs"
        aria-labelledby="telemetry-tab-sdgs"
        hidden={activeTab !== "sdgs"}
      >
        <div className="cosmos-panel-inner cosmos-panel-animate">
          <p className="cosmos-panel-kicker">{labels.sdgHeading}</p>
          <div className="cosmos-rows">
            {topSdgs.map((item, index) => {
              const barPct = Math.round((item.caseCount / maxSdgCases) * 100);
              const pctOfCollection =
                totalCases > 0
                  ? Math.round((item.caseCount / totalCases) * 100)
                  : 0;
              return (
                <Link
                  key={item.sdg}
                  href={localeHref(`/atlas?q=${encodeURIComponent(`SDG ${item.sdg}`)}`, locale)}
                  className="cosmos-dash-row cosmos-dash-row-link stagger-row"
                  style={{ "--row-i": index } as CSSProperties}
                >
                  <span className="cosmos-row-name tnum">
                    SDG {String(item.sdg).padStart(2, "0")}
                  </span>
                  <span className="cosmos-track" aria-hidden="true">
                    <span
                      className="cosmos-fill"
                      style={
                        {
                          "--w": `${barPct}%`,
                          "--d": `${index * 30}ms`,
                        } as CSSProperties
                      }
                    />
                  </span>
                  <span className="cosmos-row-val tnum">
                    {item.caseCount}/{totalCases} ({pctOfCollection}%)
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="cosmos-sdg-chips">
            {sdgCoverage.slice(6).map((item, index) => (
              <Link
                key={item.sdg}
                href={localeHref(`/atlas?q=${encodeURIComponent(`SDG ${item.sdg}`)}`, locale)}
                className="cosmos-sdg-chip tnum stagger-row"
                style={{ "--row-i": index + 6 } as CSSProperties}
              >
                SDG {item.sdg} · {item.caseCount}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Tab 3: 3 Indonesian Cases */}
      <div
        role="tabpanel"
        id="telemetry-panel-indonesia"
        aria-labelledby="telemetry-tab-indonesia"
        hidden={activeTab !== "indonesia"}
      >
        <div className="cosmos-panel-inner cosmos-panel-animate">
          <p className="cosmos-panel-kicker">{labels.indonesiaHeading}</p>
          <ul className="cosmos-id-list">
            {indonesiaCases.map((item, index) => (
              <li
                key={item.slug}
                className="cosmos-id-card stagger-row"
                style={{ "--row-i": index } as CSSProperties}
              >
                <div className="cosmos-id-meta">
                  <span
                    className="cosmos-row-dot"
                    style={{ backgroundColor: item.domainColor }}
                    aria-hidden="true"
                  />
                  <span>{item.domainName}</span>
                  <span className="cosmos-id-sep" aria-hidden="true">
                    ·
                  </span>
                  <span className="tnum">
                    {item.region}
                    {item.year ? `, ${item.year}` : ""}
                  </span>
                </div>
                <div className="cosmos-id-body">
                  <div>
                    <h3 className="cosmos-id-title">{item.title}</h3>
                    {item.metricValue !== null && (
                      <p className="cosmos-id-metric tnum">
                        <strong>{formatMetricValue(item.metricValue, locale)}</strong>{" "}
                        <span>{item.metricUnit}</span>
                        <span className="cosmos-id-metric-label">
                          {" "}
                          · {item.metricLabel}
                        </span>
                      </p>
                    )}
                  </div>
                  <Link
                    href={localeHref(`/cases/${item.slug}`, locale)}
                    className="cosmos-id-link"
                  >
                    <span>{labels.readCase}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
