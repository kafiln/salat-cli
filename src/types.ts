export interface City {
  id: number;
  name: string;
}

export interface PrayerDef {
  prayer: string;
}

export interface PrayerTime {
  prayer: string;
  time: string;
}

export type PrayerTimes = Record<string, string>;
