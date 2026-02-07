import { HIJRI_API_URL } from "../constants.js";
import { HijriDate } from "../types.js";

export const getHijriDate = async (): Promise<HijriDate> => {
  try {
    const response = await fetch(HIJRI_API_URL);
    const text = await response.text();

    // The API returns a plain text string in Arabic
    // e.g., "السبت 18 شعبان 1447هـ | الموافق 07 فبراير 2026م"
    if (!text) {
      throw new Error("Empty response from hijri date API");
    }

    // Clean up the text by removing any trailing % or whitespace
    const cleanedDate = text.trim().replace(/%\s*$/, "");

    return {
      date: cleanedDate,
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch hijri date: ${error.message}`);
  }
};
