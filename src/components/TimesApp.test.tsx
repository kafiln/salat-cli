import { usePrayerTimes } from "#hooks/usePrayerTimes";
import { render } from "ink-testing-library";
import { describe, expect, it, vi } from "vitest";
import TimesApp from "./TimesApp.js";

vi.mock("#hooks/usePrayerTimes", () => ({
  usePrayerTimes: vi.fn(),
}));

vi.mock("ink", async () => {
  const actual = await vi.importActual("ink");
  return {
    ...actual,
    useApp: vi.fn(() => ({
      exit: vi.fn(),
    })),
  };
});

describe("TimesApp", () => {
  it("should render loading state", () => {
    vi.mocked(usePrayerTimes).mockReturnValue({
      prayerTimes: null,
      error: null,
      loading: true,
      resolvedCityName: "",
    });

    const { lastFrame } = render(<TimesApp />);
    expect(lastFrame()).toContain("Loading prayer times...");
  });

  it("should render error state", () => {
    vi.mocked(usePrayerTimes).mockReturnValue({
      prayerTimes: null,
      error: "Failed to fetch",
      loading: false,
      resolvedCityName: "",
    });

    const { lastFrame } = render(<TimesApp />);
    expect(lastFrame()).toContain("Error: Failed to fetch");
  });

  it("should render null prayerTimes state", () => {
    vi.mocked(usePrayerTimes).mockReturnValue({
      prayerTimes: null,
      error: null,
      loading: false,
      resolvedCityName: "",
    });

    const { lastFrame } = render(<TimesApp />);
    expect(lastFrame()).toContain("Could not fetch prayer times.");
  });

  it("should render prayer times", () => {
    const mockPrayerTimes = {
      Fajr: "05:00",
      Chorouq: "06:30",
      Dhuhr: "12:30",
      Asr: "15:45",
      Maghrib: "18:20",
      Ishae: "19:50",
    };

    vi.mocked(usePrayerTimes).mockReturnValue({
      prayerTimes: mockPrayerTimes,
      error: null,
      loading: false,
      resolvedCityName: "Marrakech",
    });

    const { lastFrame } = render(<TimesApp />);

    expect(lastFrame()).toContain("Marrakech, Morocco");
    expect(lastFrame()).toContain("Fajr");
    expect(lastFrame()).toContain("05:00 AM");
    // Check for prayer times rendering
    expect(lastFrame()).toContain("Next Prayer");
    expect(lastFrame()).toContain("Dhuhr");
    expect(lastFrame()).toContain("12:30 PM");
  });
});
