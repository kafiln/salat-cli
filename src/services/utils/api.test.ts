import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { API_URL } from "../constants.js";
import { getData } from "./api.js";

describe("api utils", () => {
  describe("getData", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should fetch data from the correct URL", async () => {
      const mockResponse = [{ Fajr: "05:00", Dhuhr: "12:30" }];
      
      global.fetch = vi.fn(() => 
        Promise.resolve({
            json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      // Mock date to consistent values for URL construction
      const mockDate = new Date(2023, 0, 15); // Jan 15th
      vi.useFakeTimers();
      vi.setSystemTime(mockDate);

      const result = await getData(1);

      // Month is 0-indexed in Date, so +1 = 1
      const expectedUrl = `${API_URL}/prieres/ville/1/1/15`;
      
      expect(global.fetch).toHaveBeenCalledWith(expectedUrl);
      expect(result).toEqual(mockResponse[0]);

      vi.useRealTimers();
    });

    it("should throw error if fetch returns empty data", async () => {
        global.fetch = vi.fn(() => 
            Promise.resolve({
                json: () => Promise.resolve([]),
            } as Response)
          );

      await expect(getData(1)).rejects.toThrow("No prayer data returned");
    });

    it("should throw error if fetch fails", async () => {
       global.fetch = vi.fn(() => Promise.reject(new Error("Network error")));

      await expect(getData(1)).rejects.toThrow("Network error");
    });
  });
});
