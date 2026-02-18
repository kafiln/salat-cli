import { render } from "ink-testing-library";
import { Text } from "ink";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { useHijriDate } from "./useHijriDate.js";

// Mock useQuery
const mockUseQuery = vi.fn();
vi.mock("@tanstack/react-query", () => ({
  useQuery: (options: any) => mockUseQuery(options),
}));

const TestComponent = () => {
  const result = useHijriDate();
  return <Text>{JSON.stringify(result)}</Text>;
};

describe("useHijriDate", () => {
  it("should return loading state initially", () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      error: null,
      isPending: true,
    });

    const { lastFrame } = render(<TestComponent />);
    const result = JSON.parse(lastFrame()!);

    expect(result.loading).toBe(true);
    expect(result.hijriDate).toBeNull();
    expect(result.error).toBeNull();
  });

  it("should return data when query succeeds", () => {
    const mockDate = "18 Sha'ban 1447";
    mockUseQuery.mockReturnValue({
      data: mockDate,
      error: null,
      isPending: false,
    });

    const { lastFrame } = render(<TestComponent />);
    const result = JSON.parse(lastFrame()!);

    expect(result.loading).toBe(false);
    expect(result.hijriDate).toBe(mockDate);
    expect(result.error).toBeNull();
  });

  it("should return error when query fails", () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      error: new Error("Failed to fetch"),
      isPending: false,
    });

    const { lastFrame } = render(<TestComponent />);
    const result = JSON.parse(lastFrame()!);

    expect(result.loading).toBe(false);
    expect(result.hijriDate).toBeNull();
    expect(result.error).toBe("Failed to fetch");
  });
});
