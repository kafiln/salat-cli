import { getHijriDate } from "#services/utils/hijri";
import { render } from "ink-testing-library";
import { describe, expect, it, vi } from "vitest";
import HijriApp from "./HijriApp.js";

vi.mock("#services/utils/hijri", () => ({
  getHijriDate: vi.fn(),
}));

describe("HijriApp", () => {
  it("should render loading state", () => {
    vi.mocked(getHijriDate).mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    const { lastFrame } = render(<HijriApp />);
    expect(lastFrame()).toContain("Loading hijri date...");
  });

  it("should render error state", async () => {
    vi.mocked(getHijriDate).mockRejectedValue(new Error("Network error"));

    const { lastFrame } = render(<HijriApp />);

    // Wait for async operation
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(lastFrame()).toContain("Error: Network error");
  });

  it("should render hijri date", async () => {
    const mockDate = "السبت 18 شعبان 1447هـ | الموافق 07 فبراير 2026م";

    vi.mocked(getHijriDate).mockResolvedValue({ date: mockDate });

    const { lastFrame } = render(<HijriApp />);

    // Wait for async operation
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(lastFrame()).toContain("Hijri Date");
    expect(lastFrame()).toContain(mockDate);
  });
});
