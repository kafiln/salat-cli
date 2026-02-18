import { describe, expect, it } from "vitest";
import { cleanHijriDateText } from "./parseHijri.js";

describe("parseHijri", () => {
  it("should parse valid hijri date string", () => {
    const input = "السبت 18 شعبان 1447هـ | الموافق 07 فبراير 2026م";
    const result = cleanHijriDateText(input);
    expect(result).toBe("18 Sha'ban 1447");
  });

  it("should throw error for invalid format", () => {
    const input = "Invalid date string";
    expect(() => cleanHijriDateText(input)).toThrow("Hijri not correct");
  });

  it("should use arabic month name if English mapping is missing", () => {
    // This case theoretically shouldn't happen with standard months but tests the fallback branch
    const input = "السبت 18 الشهرالغيرمعروف 1447هـ";
    const result = cleanHijriDateText(input);
    expect(result).toBe("18 الشهرالغيرمعروف 1447");
  });
});
