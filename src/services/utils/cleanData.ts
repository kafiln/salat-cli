/**
 * Cleans up a hijri date string by trimming whitespace and removing trailing '%'
 * @param text - The raw hijri date text to clean
 * @returns The cleaned hijri date string
 */
export const cleanHijriDateText = (text: string): string => {
  return text.trim().replace(/%\s*$/, "");
};
