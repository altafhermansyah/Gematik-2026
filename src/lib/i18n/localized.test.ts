import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { pickLocalized, resolveLocalized } from "./localized";

describe("pickLocalized & resolveLocalized", () => {
  it("selects requested locale and trims surrounding whitespace", () => {
    const text = { id: "  Halo Dunia  ", en: "  Hello World  " };
    assert.deepEqual(pickLocalized(text, "id"), { ok: true, value: "Halo Dunia" });
    assert.deepEqual(pickLocalized(text, "en"), { ok: true, value: "Hello World" });
  });

  it("falls back to the opposite locale if the requested string is empty", () => {
    const partial = { id: "Satu bahasa", en: "   " };
    assert.deepEqual(pickLocalized(partial, "en"), {
      ok: true,
      value: "Satu bahasa",
    });
  });

  it("rejects malformed or empty bilingual values", () => {
    assert.equal(pickLocalized({ id: " ", en: "" }, "id").ok, false);
    assert.equal(pickLocalized(null, "id").ok, false);
    assert.throws(
      () => resolveLocalized({ id: "", en: "" }, "test.field", "en"),
      /test\.field/
    );
  });
});
