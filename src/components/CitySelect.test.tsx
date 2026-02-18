import { render } from "ink-testing-library";
import { describe, expect, it, vi } from "vitest";
import CitySelect from "./CitySelect.js";

// Mock data
vi.mock("../data/cities.json", () => ({
    default: [
        { frenchName: "Casablanca", arabicName: "الدار البيضاء" },
        { frenchName: "Rabat", arabicName: "الرباط" },
        { frenchName: "Tangier", arabicName: "طنجة" },
    ],
}));

describe("CitySelect", () => {
    it("should render input and list", () => {
        const { lastFrame } = render(<CitySelect onSelect={() => { }} />);
        expect(lastFrame()).toContain("SELECT YOUR CITY");
        expect(lastFrame()).toContain("Casablanca");
        expect(lastFrame()).toContain("Rabat");
    });

    it("should show no results message when no match", async () => {
        const { lastFrame, stdin } = render(<CitySelect onSelect={() => { }} />);
        stdin.write("NonExistentCity");
        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(lastFrame()).toContain("No cities found");
    });

    it("should filter cities by french name", async () => {
        const { lastFrame, stdin } = render(<CitySelect onSelect={() => { }} />);
        stdin.write("Rab");
        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(lastFrame()).toContain("Rabat");
        expect(lastFrame()).not.toContain("Casablanca");
    });

    it("should select a city", () => {
        const onSelect = vi.fn();
        const { stdin, lastFrame } = render(<CitySelect onSelect={onSelect} />);

        // Select first item (Casablanca)
        stdin.write("\r");
        expect(onSelect).toHaveBeenCalledWith("Casablanca");
    });
});
