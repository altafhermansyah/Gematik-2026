import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  generateLocalFallback,
  isQueryInDomain,
} from "@/modules/assistant/local-engine";
import { getPublishedCases } from "@/modules/content/store";

describe("assistant local engine", () => {
  it("accepts in-domain queries and rejects out-of-scope or removed path/quiz terms", () => {
    assert.equal(isQueryInDomain("Inovasi apa saja di Indonesia?"), true);
    assert.equal(isQueryInDomain("Bagaimana AI dan drone membantu petani?"), true);

    assert.equal(isQueryInDomain("resep nasi goreng"), false);
    assert.equal(isQueryInDomain("jadwal liga inggris"), false);

    // /paths and /quiz are intentionally not part of the platform
    assert.equal(isQueryInDomain("roadmap"), false);
    assert.equal(isQueryInDomain("skill"), false);
    assert.equal(isQueryInDomain("jalur"), false);
    assert.equal(isQueryInDomain("quiz"), false);
  });

  it("returns all Indonesian published cases in Indonesian without lang query", () => {
    const expectedIndoSlugs = getPublishedCases()
      .filter((c) => c.countryCode === "ID")
      .map((c) => c.slug)
      .sort();

    const result = generateLocalFallback("Inovasi apa saja di Indonesia?", "id");

    assert.equal(result.isInContext, true);
    assert.equal(result.isFallback, true);
    assert.deepEqual([...(result.caseSlugs ?? [])].sort(), expectedIndoSlugs);
    assert.equal(expectedIndoSlugs.length, 3);
    for (const slug of expectedIndoSlugs) {
      assert.match(result.reply, new RegExp(`/cases/${slug}\\)`));
    }
  });

  it("preserves ?lang=en on internal links in English mode", () => {
    const expectedIndoSlugs = getPublishedCases()
      .filter((c) => c.countryCode === "ID")
      .map((c) => c.slug);

    const result = generateLocalFallback(
      "What innovations are in Indonesia?",
      "en"
    );

    assert.equal(result.isInContext, true);
    assert.equal(result.isFallback, true);
    assert.equal(result.caseSlugs?.length, 3);
    for (const slug of expectedIndoSlugs) {
      assert.ok(
        result.reply.includes(`/cases/${slug}?lang=en`),
        `Expected EN link for ${slug}`
      );
    }

    const outOfScope = generateLocalFallback("resep nasi goreng", "en");
    assert.equal(outOfScope.isInContext, false);
    assert.equal(outOfScope.caseSlugs, undefined);

    const singleCase = generateLocalFallback(
      "Tell me about Wolbachia in Yogyakarta",
      "en"
    );
    assert.equal(singleCase.isInContext, true);
    assert.ok(singleCase.reply.includes("?lang=en"));
  });
});
