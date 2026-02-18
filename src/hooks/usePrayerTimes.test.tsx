import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "ink-testing-library";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePrayerTimes } from "./usePrayerTimes.js";

// Mock dependencies
vi.mock("#services/utils/api", () => ({
  getData: vi.fn(),
}));

import { getData } from "#services/utils/api";

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const TestComponent = ({ hookProps = {}, onRender }: { hookProps?: any, onRender: (res: any) => void }) => {
  const result = usePrayerTimes(hookProps);
  onRender(result);
  return null;
};

const waitFor = async (condition: () => void, timeout = 1000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      condition();
      return;
    } catch (e) {
      await new Promise((r) => setTimeout(r, 50));
    }
  }
  condition(); // Run one last time to throw if still failing
};

describe("usePrayerTimes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch data", async () => {
    const mockData = {
      Fajr: "05:00",
      Chorouq: "06:30",
      Dhuhr: "12:30",
      Asr: "15:45",
      Maghrib: "18:20",
      Ishae: "19:50"
    };
    vi.mocked(getData).mockResolvedValue(mockData);

    let result: any;
    const Wrapper = createTestWrapper();
    render(
      <Wrapper>
        <TestComponent hookProps={{ cityNameArg: "Rabat" }} onRender={(res) => result = res} />
      </Wrapper>
    );

    // Initial loading
    expect(result.loading).toBe(true);

    // Wait for success
    await waitFor(() => expect(result.loading).toBe(false));

    expect(result.prayerTimes).toEqual(mockData);
  });
});
