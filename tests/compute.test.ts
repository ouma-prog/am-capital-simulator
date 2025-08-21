import { describe, it, expect } from "vitest";
import { compute, type ResultsFull } from "../app/lib/compute";

describe("compute()", () => {
  it("calcule correctement rendement et cashflow en location longue", () => {
    const r: ResultsFull = compute(100000, 50, "longue", "t2");

    // 9% de 100k
    expect(r.fraisNotaire).toBeCloseTo(9000, 0);
    // Commission 8.5% : 8500
    expect(r.commissionAM).toBeCloseTo(8500, 0);
    // Archi 90€/m² * 50 = 4500
    expect(r.fraisArchitecte).toBeCloseTo(4500, 0);

    expect(r.investissementTotal).toBeCloseTo(100000 + 9000 + 8500 + 4500, 0);
    expect(r.rendement).toBeGreaterThan(0);
    expect(Number.isFinite(r.cashflow)).toBe(true);
  });
});
