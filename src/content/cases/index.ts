/**
 * Galeri kasus Atlas.
 *
 * Dipecah per bidang agar setiap berkas tetap bisa dibaca dan ditinjau. Urutan
 * di sini tidak menentukan urutan tampilan: `getPublishedCases()` mengurutkan
 * `featured` lebih dulu lalu slug.
 */

import type { CaseStudy } from "@/modules/content/types";
import { climateCases } from "./climate";
import { disasterCases } from "./disaster";
import { educationCases } from "./education";
import { foodCases } from "./food";
import { healthCases } from "./health";
import { inclusionCases } from "./inclusion";

export const cases: readonly CaseStudy[] = [
  ...climateCases,
  ...disasterCases,
  ...educationCases,
  ...foodCases,
  ...healthCases,
  ...inclusionCases,
];
