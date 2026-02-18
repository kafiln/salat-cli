import { useHijriDate } from "#hooks/useHijriDate";
import { usePrayerTimes } from "#hooks/usePrayerTimes";
import { useApp } from "ink";
import { render } from "ink-testing-library";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TimesApp from "./TimesApp.js";

vi.mock("#hooks/usePrayerTimes", () => ({
  usePrayerTimes: vi.fn(),
}));

vi.mock("#hooks/useHijriDate", () => ({
  useHijriDate: vi.fn(),
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
  beforeEach(() => {
    vi.mocked(useHijriDate).mockReturnValue({
      hijriDate: "18 Sha'ban 1447",
      error: null,
      loading: false,
    });
  });

  it("should render loading state", () => {
    vi.mocked(usePrayerTimes).mockReturnValue({
      prayerTimes: null,
      tomorrowTimes: null,
      error: null,
      loading: true,
      resolvedCityName: "Marrakech",
    });

    const { lastFrame } = render(<TimesApp />);
    expect(lastFrame()).toContain("Loading prayer times for Marrakech");
  });

  it("should render error state", () => {
    vi.mocked(usePrayerTimes).mockReturnValue({
      prayerTimes: null,
      tomorrowTimes: null,
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
      tomorrowTimes: null,
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
      tomorrowTimes: null,
      error: null,
      loading: false,
      resolvedCityName: "Marrakech",
    });

    const { lastFrame } = render(<TimesApp />);

    expect(lastFrame()).toContain("Marrakech");
    expect(lastFrame()).toContain("Fajr");
    expect(lastFrame()).toContain("05:00 AM");
  });

  it("should render Iftar progress when fasting", () => {
    const mockPrayerTimes = {
      Fajr: "05:00",
      Chorouq: "06:30",
      Dhuhr: "12:30",
      Asr: "15:45",
      Maghrib: "18:20",
      Ishae: "19:50",
    };

    // Use a fixed date for the test
    const mockNow = new Date("2026-02-18T12:00:00");
    vi.setSystemTime(mockNow);

    vi.mocked(usePrayerTimes).mockReturnValue({
      prayerTimes: mockPrayerTimes,
      tomorrowTimes: mockPrayerTimes,
      error: null,
      loading: false,
      resolvedCityName: "Marrakech",
    });

    const { lastFrame } = render(<TimesApp />);

    expect(lastFrame()).toContain("Iftar Progress");
    // (12:00 - 05:00) / (18:20 - 05:00) = 7h / 13h 20m = 420m / 800m = 0.525 = 53%
    expect(lastFrame()).toContain("53%");
  });

  it("should render Time to Imsak when not fasting (after Maghrib)", () => {
    const mockPrayerTimes = {
      Fajr: "05:00",
      Chorouq: "06:30",
      Dhuhr: "12:30",
      Asr: "15:45",
      Maghrib: "18:20",
      Ishae: "19:50",
    };

    // Use a fixed date for the test (9:00 PM)
    const mockNow = new Date("2026-02-18T21:00:00");
    vi.setSystemTime(mockNow);

    vi.mocked(usePrayerTimes).mockReturnValue({
      prayerTimes: mockPrayerTimes,
      tomorrowTimes: mockPrayerTimes, // Tomorrow's Fajr 05:00 -> Imsak 04:50
      error: null,
      loading: false,
      resolvedCityName: "Marrakech",
    });

    const { lastFrame } = render(<TimesApp />);

    expect(lastFrame()).toContain("Time to Imsak");
    // From 21:00 to 04:50 is 7 hours and 50 minutes
    expect(lastFrame()).toContain("07:50:00");
  });

  it("should call exit() when once is true and loading is finished", () => {
    const mockExit = vi.fn();
    vi.mocked(useApp).mockReturnValue({ exit: mockExit });

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
      tomorrowTimes: null,
      error: null,
      loading: false,
      resolvedCityName: "Marrakech",
    });

    render(<TimesApp once={true} />);

    expect(mockExit).toHaveBeenCalled();
  });
});
