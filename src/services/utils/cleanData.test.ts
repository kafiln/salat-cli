import { describe, expect, it } from "vitest";
import { cleanHijriDateText } from "./cleanData.js";

describe("cleanHijriDateText", () => {
  it("should return the same string when no cleaning is needed", () => {
    const input = "السبت 18 شعبان 1447هـ | الموافق 07 فبراير 2026م";
    const result = cleanHijriDateText(input);
    expect(result).toBe(input);
  });

  it("should trim leading whitespace", () => {
    const input = "  السبت 18 شعبان 1447هـ";
    const expected = "السبت 18 شعبان 1447هـ";
    expect(cleanHijriDateText(input)).toBe(expected);
  });

  it("should trim trailing whitespace", () => {
    const input = "السبت 18 شعبان 1447هـ  ";
    const expected = "السبت 18 شعبان 1447هـ";
    expect(cleanHijriDateText(input)).toBe(expected);
  });

  it("should remove trailing %", () => {
    const input = "السبت 18 شعبان 1447هـ%";
    const expected = "السبت 18 شعبان 1447هـ";
    expect(cleanHijriDateText(input)).toBe(expected);
  });

  it("should remove trailing % with whitespace before it", () => {
    const input = "السبت 18 شعبان 1447هـ %";
    const expected = "السبت 18 شعبان 1447هـ ";
    expect(cleanHijriDateText(input)).toBe(expected);
  });

  it("should remove trailing % with multiple spaces before it", () => {
    const input = "السبت 18 شعبان 1447هـ   %";
    const expected = "السبت 18 شعبان 1447هـ   ";
    expect(cleanHijriDateText(input)).toBe(expected);
  });

  it("should handle text with both leading/trailing whitespace and trailing %", () => {
    const input = "  السبت 18 شعبان 1447هـ  %  ";
    const expected = "السبت 18 شعبان 1447هـ  ";
    expect(cleanHijriDateText(input)).toBe(expected);
  });

  it("should return empty string for empty input", () => {
    expect(cleanHijriDateText("")).toBe("");
  });

  it("should return empty string for whitespace-only input", () => {
    expect(cleanHijriDateText("   ")).toBe("");
  });

  it("should handle only % character", () => {
    expect(cleanHijriDateText("%")).toBe("");
  });

  it("should handle % with surrounding whitespace", () => {
    expect(cleanHijriDateText("  %  ")).toBe("");
  });

  it("should not remove % from the middle of the text", () => {
    const input = "السبت % 18 شعبان 1447هـ";
    expect(cleanHijriDateText(input)).toBe(input);
  });

  it("should only remove trailing %, not leading", () => {
    const input = "% السبت 18 شعبان 1447هـ";
    expect(cleanHijriDateText(input)).toBe(input);
  });
});
