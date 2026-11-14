import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getPublishedCases } from "@/modules/content/store";
import { caseLatLngToSpherePoint } from "./planet-coordinates";

describe("caseLatLngToSpherePoint", () => {
  it("aligns Prime Meridian Equator (0, 0) to -Z and +90E to -X", () => {
    const prime = caseLatLngToSpherePoint(0, 0, 10);
    assert.ok(Math.abs(prime.x) < 1e-9);
    assert.ok(Math.abs(prime.y) < 1e-9);
    assert.ok(Math.abs(prime.z - -10) < 1e-9);

    const east90 = caseLatLngToSpherePoint(0, 90, 10);
    assert.ok(Math.abs(east90.x - -10) < 1e-9);
    assert.ok(Math.abs(east90.y) < 1e-9);
    assert.ok(Math.abs(east90.z) < 1e-9);
  });

  it("places Indonesian southern-eastern cases and US northern-western cases in matching octants", () => {
    const jakarta = caseLatLngToSpherePoint(-6.2088, 106.8456, 10.06);
    assert.ok(jakarta.x < 0, "Jakarta (+106.8E) should have negative x");
    assert.ok(jakarta.y < 0, "Jakarta (-6.2S) should have negative y");
    assert.ok(jakarta.z > 0, "Jakarta (+106.8E > 90E) should have positive z");

    const washington = caseLatLngToSpherePoint(38.9059, -77.0431, 10.06);
    assert.ok(washington.x > 0, "Washington (-77W) should have positive x");
    assert.ok(washington.y > 0, "Washington (+38.9N) should have positive y");
    assert.ok(washington.z < 0, "Washington (-77W > -90W) should have negative z");
  });

  it("maps every published KarsaLoka case onto exact sphere radius", () => {
    const r = 10.06;
    for (const c of getPublishedCases()) {
      const p = caseLatLngToSpherePoint(c.lat, c.lng, r);
      const len = Math.hypot(p.x, p.y, p.z);
      assert.ok(Math.abs(len - r) < 1e-6, `${c.slug} radius mismatch: ${len}`);
    }
  });
});
