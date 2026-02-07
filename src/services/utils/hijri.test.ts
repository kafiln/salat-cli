import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getHijriDate } from "./hijri.js";

describe("hijri service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch hijri date successfully", async () => {
    const mockResponse = "السبت 18 شعبان 1447هـ | الموافق 07 فبراير 2026م";

    global.fetch = vi.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve(mockResponse),
      } as Response),
    );

    const result = await getHijriDate();

    expect(result.date).toBe(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://apisearch.hadithm6.ma/api/hijridate",
    );
  });

  it("should handle empty response", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve(""),
      } as Response),
    );

    await expect(getHijriDate()).rejects.toThrow(
      "Empty response from hijri date API",
    );
  });

  it("should handle network errors", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("Network error")));

    await expect(getHijriDate()).rejects.toThrow("Failed to fetch hijri date");
  });

  it("should clean up trailing % from response", async () => {
    const mockResponse = "السبت 18 شعبان 1447هـ | الموافق 07 فبراير 2026م%";

    global.fetch = vi.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve(mockResponse),
      } as Response),
    );

    const result = await getHijriDate();

    expect(result.date).toBe("السبت 18 شعبان 1447هـ | الموافق 07 فبراير 2026م");
  });
});
