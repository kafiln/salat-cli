/**
 * Cleans up a hijri date string by trimming whitespace and removing trailing '%'
 * @param text - The raw hijri date text to clean
 * @returns The cleaned hijri date string
 */
export const cleanHijriDateText = (text: string): string => {
  // Arabic → English Hijri months map
  const hijriMonthMap: Record<string, string> = {
    محرم: "Muharram",
    صفر: "Safar",
    "ربيع الأول": "Rabi al-Awwal",
    "ربيع الآخر": "Rabi al-Thani",
    "جمادى الأولى": "Jumada al-Awwal",
    "جمادى الآخرة": "Jumada al-Thani",
    رجب: "Rajab",
    شعبان: "Sha'ban",
    رمضان: "Ramadan",
    شوال: "Shawwal",
    "ذو القعدة": "Dhu al-Qi'dah",
    "ذو الحجة": "Dhu al-Hijjah",
  };

  const hijriRegex = /^(\S+)\s+(\d+)\s+(.+?)\s+(\d+)هـ/;

  const match = text.match(hijriRegex);

  if (!match) throw new Error("Hijri not correct");

  const result = {
    weekday: match[1],
    day: Number(match[2]),
    monthArabic: match[3],
    monthEnglish: hijriMonthMap[match[3]] || match[3],
    year: Number(match[4]),
  };

  return `${result.day} ${result.monthEnglish} ${result.year}`;
};
