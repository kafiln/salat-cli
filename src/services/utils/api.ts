import { PRIERE_API_URL } from "#services/constants";
import { PrayerTimes } from "#services/types";
// import fetch from "node-fetch";

export const getData = async (cityId: number) => {
  const day = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const url = PRIERE_API_URL(cityId, day, month);
  const response = await fetch(url);
  const data = (await response.json()) as PrayerTimes[];
  if (!data.length) {
    throw new Error("No prayer data returned");
  }
  return data[0];
};
