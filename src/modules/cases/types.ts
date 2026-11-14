export type CaseMetric = {
  label: string;
  value: number;
  unit: string;
  quote?: string;
  sourceUrl?: string;
};

export type CaseSourceItem = {
  title: string;
  publisher: string | null;
  url: string;
  accessedAt: string | null;
};

export type CaseDetail = {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  aiRole: string;
  impact: string;
  metrics: CaseMetric[];
  countryCode: string;
  region: string | null;
  lat?: number;
  lng?: number;
  year: number | null;
  sdgs: number[];
  technologies: string[];
  domain: {
    slug: string;
    name: string;
    color: string;
  };
  sources: CaseSourceItem[];
};
