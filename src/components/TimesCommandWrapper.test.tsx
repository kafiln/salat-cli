import { render } from "ink-testing-library";
import { describe, expect, it, vi } from "vitest";
import TimesCommandWrapper from "./TimesCommandWrapper.js";

// Mock dependencies
vi.mock("#components/CitySelect", async () => {
    const { Text } = await import("ink");
    return {
        default: ({ onSelect }: { onSelect: (city: string) => void }) => {
            // Trigger onSelect immediately? No, we need to test rendering.
            return <Text>CitySelect Mock</Text>;
        },
    };
});

vi.mock("#components/TimesApp", async () => {
    const { Text } = await import("ink");
    return {
        default: ({ cityNameArg }: { cityNameArg: string }) => (
            <Text>TimesApp Mock: {cityNameArg}</Text>
        ),
    };
});

vi.mock("#components/QueryProvider", () => ({
    QueryProvider: ({ children }: { children: React.ReactNode }) => (
        <>{children}</>
    ),
}));


describe("TimesCommandWrapper", () => {
    it("should render TimesApp if initialCity is provided", () => {
        const { lastFrame } = render(<TimesCommandWrapper initialCity="Casablanca" />);
        expect(lastFrame()).toContain("TimesApp Mock: Casablanca");
        expect(lastFrame()).not.toContain("CitySelect Mock");
    });

    it("should render CitySelect if no initialCity provided", () => {
        const { lastFrame } = render(<TimesCommandWrapper />);
        expect(lastFrame()).toContain("CitySelect Mock");
        expect(lastFrame()).not.toContain("TimesApp Mock");
    });
});
