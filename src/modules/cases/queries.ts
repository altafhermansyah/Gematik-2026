import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { pickLocalized, DEFAULT_LOCALE } from "@/lib/i18n/localized";
import { CaseMetricsSchema } from "./schemas";
import type { CaseDetail, CaseMetric } from "./types";

/**
 * Fetches a single published case by its unique slug.
 * Resolves localized JSON fields to plain strings on the server.
 * Explicitly validates `metrics` JSON using Zod.
 * Throws on data integrity failures so the route error boundary handles invalid database data.
 * Wrapped with React cache() to deduplicate requests between generateMetadata and the page component.
 */
export const getCaseBySlug = cache(
  async (slug: string): Promise<CaseDetail | null> => {
    const row = await prisma.case.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
      },
      select: {
        slug: true,
        title: true,
        summary: true,
        problem: true,
        solution: true,
        aiRole: true,
        impact: true,
        metrics: true,
        countryCode: true,
        region: true,
        year: true,
        sdgs: true,
        technologies: true,
        domain: {
          select: {
            slug: true,
            name: true,
            color: true,
          },
        },
        sources: {
          select: {
            title: true,
            publisher: true,
            url: true,
            accessedAt: true,
          },
          orderBy: {
            title: "asc",
          },
        },
      },
    });

    if (!row) {
      return null;
    }

    // Helper for resolving required localized fields; throws on data integrity failure
    const resolveField = (field: unknown, fieldName: string): string => {
      const res = pickLocalized(field, DEFAULT_LOCALE);
      if (!res.ok) {
        console.error(
          `[modules/cases/queries] getCaseBySlug: case "${slug}" field "${fieldName}" failed validation: ${res.error}`
        );
        throw new Error(
          `Data integrity error: case "${slug}" field "${fieldName}" failed validation (${res.error})`
        );
      }
      return res.value;
    };

    const title = resolveField(row.title, "title");
    const summary = resolveField(row.summary, "summary");
    const problem = resolveField(row.problem, "problem");
    const solution = resolveField(row.solution, "solution");
    const aiRole = resolveField(row.aiRole, "aiRole");
    const impact = resolveField(row.impact, "impact");
    const domainName = resolveField(row.domain.name, "domain.name");

    // Validate and resolve metrics if present
    let metrics: CaseMetric[] = [];
    if (row.metrics !== null && row.metrics !== undefined) {
      const parsedMetrics = CaseMetricsSchema.safeParse(row.metrics);
      if (!parsedMetrics.success) {
        console.error(
          `[modules/cases/queries] getCaseBySlug: case "${slug}" field "metrics" failed Zod validation: ${parsedMetrics.error.message}`
        );
        throw new Error(
          `Data integrity error: case "${slug}" field "metrics" failed Zod validation`
        );
      }

      metrics = parsedMetrics.data.map((m, index) => {
        const labelRes = pickLocalized(m.label, DEFAULT_LOCALE);
        if (!labelRes.ok) {
          console.error(
            `[modules/cases/queries] getCaseBySlug: case "${slug}" metrics[${index}].label failed validation: ${labelRes.error}`
          );
          throw new Error(
            `Data integrity error: case "${slug}" metrics[${index}].label failed validation`
          );
        }
        return {
          label: labelRes.value,
          value: m.value,
          unit: m.unit,
        };
      });
    }

    const sources = row.sources.map((s) => ({
      title: s.title,
      publisher: s.publisher,
      url: s.url,
      accessedAt: s.accessedAt ? s.accessedAt.toISOString() : null,
    }));

    return {
      slug: row.slug,
      title,
      summary,
      problem,
      solution,
      aiRole,
      impact,
      metrics,
      countryCode: row.countryCode,
      region: row.region,
      year: row.year,
      sdgs: row.sdgs,
      technologies: row.technologies,
      domain: {
        slug: row.domain.slug,
        name: domainName,
        color: row.domain.color,
      },
      sources,
    };
  }
);
