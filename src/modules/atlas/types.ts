export type AtlasCase = {
  slug: string;
  title: string;
  summary: string;
  lat: number;
  lng: number;
  countryCode: string;
  region: string | null;
  domain: { slug: string; name: string; color: string };
};
