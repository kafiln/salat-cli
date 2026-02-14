import { useHijriDate } from "#hooks/useHijriDate";
import { render } from "ink-testing-library";
import { describe, expect, it, vi } from "vitest";
import HijriApp from "./HijriApp.js";

vi.mock("#hooks/useHijriDate", () => ({
  useHijriDate: vi.fn(),
}));

describe("HijriApp", () => {
  it("should render loading state", () => {
    vi.mocked(useHijriDate).mockReturnValue({
      hijriDate: null,
      error: null,
      loading: true,
    });

    const { lastFrame } = render(<HijriApp />);
    expect(lastFrame()).toContain("Loading hijri date...");
  });

  it("should render error state", () => {
    vi.mocked(useHijriDate).mockReturnValue({
      hijriDate: null,
      error: "Network error",
      loading: false,
    });

    const { lastFrame } = render(<HijriApp />);
    expect(lastFrame()).toContain("Error: Network error");
  });

  it("should render hijri date", () => {
    const mockDate = "السبت 18 شعبان 1447هـ | الموافق 07 فبراير 2026م";

    vi.mocked(useHijriDate).mockReturnValue({
      hijriDate: mockDate,
      error: null,
      loading: false,
    });

    const { lastFrame } = render(<HijriApp />);

    expect(lastFrame()).toContain("Hijri Date");
    expect(lastFrame()).toContain(mockDate);
  });
});
