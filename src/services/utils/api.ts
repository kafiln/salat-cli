import { PRIERE_API_URL } from "#services/constants";
import { PrayerTimes } from "#services/types";

export const getData = async (cityId: number, date: Date = new Date()) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const url = PRIERE_API_URL(cityId, day, month);
  const response = await fetch(url);
  const data = (await response.json()) as PrayerTimes[];
  if (!data.length) {
    throw new Error("No prayer data returned");
  }
  return data[0];
};
