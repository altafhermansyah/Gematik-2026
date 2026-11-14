import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { cases } from "@/content/cases";
import { domains } from "@/content/domains";
import { paths } from "@/content/paths";
import { resources } from "@/content/resources";
import { skills } from "@/content/skills";
import type { CaseStudy, LearningPath } from "./types";
import { assertContentIntegrity, type ContentBundle } from "./validate";

function cloneBaseBundle(): ContentBundle {
  return {
    domains: [...domains],
    cases: structuredClone([...cases]),
    skills: [...skills],
    resources: [...resources],
    paths: structuredClone([...paths]),
  };
}

describe("assertContentIntegrity", () => {
  it("validates the live KarsaLoka curated bundle without errors", () => {
    const bundle: ContentBundle = { domains, cases, skills, resources, paths };
    assert.doesNotThrow(() => assertContentIntegrity(bundle));

    const published = cases.filter((c) => c.status === "PUBLISHED");
    assert.equal(published.length, 16);
    assert.equal(new Set(published.map((c) => c.countryCode)).size, 11);
    assert.equal(
      published.reduce((sum, c) => sum + c.metrics.length, 0),
      41
    );
    assert.equal(new Set(published.flatMap((c) => c.sdgs)).size, 12);
    assert.equal(
      published.filter((c) => c.countryCode === "ID").length,
      3
    );
  });

  it("rejects PUBLISHED case when a metric unit is missing in English", () => {
    const bundle = cloneBaseBundle();
    const mutableCases = bundle.cases as CaseStudy[];
    const first = structuredClone(mutableCases[0]);
    first.metrics[0].unit = { id: "perangkat", en: "   " };
    mutableCases[0] = first;

    assert.throws(() => assertContentIntegrity(bundle), /metrics\[0\]\.unit\.en/);
  });

  it("rejects PUBLISHED case when a metric label is empty in one locale", () => {
    const bundle = cloneBaseBundle();
    const mutableCases = bundle.cases as CaseStudy[];
    const first = structuredClone(mutableCases[0]);
    first.metrics[0].label = { id: "Judul Indonesia", en: "" };
    mutableCases[0] = first;

    assert.throws(() => assertContentIntegrity(bundle), /metrics\[0\]\.label\.en/);
  });

  it("rejects null-island (0, 0) coordinates and unlisted metric sourceUrl", () => {
    const bundle = cloneBaseBundle();
    const mutableCases = bundle.cases as CaseStudy[];
    const first = structuredClone(mutableCases[0]);
    first.lat = 0;
    first.lng = 0;
    first.metrics[0].sourceUrl = "https://example.com/unlisted-source";
    mutableCases[0] = first;

    assert.throws(
      () => assertContentIntegrity(bundle),
      (err: unknown) =>
        err instanceof Error &&
        err.message.includes("koordinat (0, 0)") &&
        err.message.includes("metrics[0].sourceUrl tidak tercantum di sources kasus ini")
    );
  });

  it("rejects cyclic prerequisite edges in learning paths", () => {
    const bundle = cloneBaseBundle();
    const mutablePaths = bundle.paths as LearningPath[];
    const path = structuredClone(mutablePaths[0]);
    const [a, b] = path.nodes;
    path.edges = [
      [a.skillSlug, b.skillSlug],
      [b.skillSlug, a.skillSlug],
    ];
    mutablePaths[0] = path;

    assert.throws(() => assertContentIntegrity(bundle), /mengandung siklus/);
  });
});
