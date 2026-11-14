export type AtlasCaseMetric = {
  label: string;
  value: number;
  unit: string;
};

export type AtlasDomain = {
  slug: string;
  name: string;
  color: string;
  order: number;
};

export type AtlasCase = {
  slug: string;
  title: string;
  summary: string;
  lat: number;
  lng: number;
  countryCode: string;
  region: string | null;
  domain: { slug: string; name: string; color: string };
  featured?: boolean;
  year?: number | null;
  sdgs?: number[];
  technologies?: string[];
  metrics?: AtlasCaseMetric[];
  sourcesCount?: number;
};
