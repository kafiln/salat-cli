import { describe, expect, it } from "vitest";
import {
    API_URL,
    DEFAULT_CITY,
    HIJRI_API_URL,
    PRIERE_API_URL,
} from "./constants.js";

describe("constants", () => {
  it("should have correct API Base URL", () => {
    expect(API_URL).toBe("https://apisearch.hadithm6.ma/api");
  });

  it("should have correct Hijri API URL", () => {
    expect(HIJRI_API_URL).toBe("https://apisearch.hadithm6.ma/api/hijridate");
  });

  it("should generate correct Prayer API URL", () => {
    const cityId = 10;
    const day = 15;
    const month = 5;
    const expectedUrl = "https://apisearch.hadithm6.ma/api/prieres/ville/10/5/15";
    
    expect(PRIERE_API_URL(cityId, day, month)).toBe(expectedUrl);
  });

    it("should have correct default city", () => {
        expect(DEFAULT_CITY).toBe("Marrakech");
    });
});
