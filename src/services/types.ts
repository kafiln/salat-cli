export interface City {
  id: number;
  name: string;
}

export type PrayerName =
  | "Fajr"
  | "Chorouq"
  | "Dhuhr"
  | "Asr"
  | "Maghrib"
  | "Ishae";

export interface PrayerTime {
  prayer: PrayerName;
  time: string;
}

export type PrayerTimes = Record<PrayerName, string>;

export interface HijriDate {
  date: string;
}
