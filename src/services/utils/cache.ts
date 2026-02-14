import { PrayerTimes } from "#services/types";
import { format } from "date-fns";

interface CacheEntry {
  data: PrayerTimes;
  date: string;
}

// In-memory cache - stores prayer times for current date only
const cache = new Map<string, CacheEntry>();

export const getCacheKey = (cityName: string): string => {
  return `${cityName.toLowerCase()}_${format(new Date(), "yyyy-MM-dd")}`;
};

export const getCachedPrayerTimes = (cityName: string): PrayerTimes | null => {
  const key = getCacheKey(cityName);
  const entry = cache.get(key);

  if (!entry) return null;

  // Validate cache is still for today
  if (entry.date !== format(new Date(), "yyyy-MM-dd")) {
    cache.delete(key);
    return null;
  }

  return entry.data;
};

export const cachePrayerTimes = (
  cityName: string,
  prayerTimes: PrayerTimes,
): void => {
  const key = getCacheKey(cityName);
  cache.set(key, {
    data: prayerTimes,
    date: format(new Date(), "yyyy-MM-dd"),
  });
};

export const clearCache = (): void => {
  cache.clear();
};
