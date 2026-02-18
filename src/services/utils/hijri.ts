import { HIJRI_API_URL } from "../constants.js";
import { cleanHijriDateText } from "./parseHijri.js";

export const getHijriDate = async (): Promise<string> => {
  try {
    const response = await fetch(HIJRI_API_URL);
    const text = await response.text();

    // The API returns a plain text string in Arabic
    // e.g., "السبت 18 شعبان 1447هـ | الموافق 07 فبراير 2026م"
    if (!text) {
      throw new Error("Empty response from hijri date API");
    }

    const cleanedDate = cleanHijriDateText(text);


    return cleanedDate;
  } catch (error: any) {
    throw new Error(`Failed to fetch hijri date: ${error.message}`);
  }
};
