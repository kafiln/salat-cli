import { API_URL, DEFAULT_CITY, NOT_FOUND_ERROR } from "#services/constants";
import { City, PrayerName, PrayerTimes } from "#services/types";
import { addDays, differenceInSeconds, format, parse } from "date-fns";
import domino from "domino";
import fetch from "node-fetch";
import prayersData from "../data/prayers.json" with { type: "json" };


export const getCityName = (arg: string | undefined, cities: City[]): string => {
  if (arg == null) return DEFAULT_CITY;
  const index = getCityIndex(arg, cities);
  if (index === -1) {
    console.error(NOT_FOUND_ERROR);
    return DEFAULT_CITY;
  }
  return arg;
};

export const getCityId = (arg: string, cities: City[]): number => {
  const parsed = parseInt(arg);
  if (parsed && cities.length >= parsed) {
    return parsed;
  }
  return getCityIndex(arg, cities) + 1;
};

const getCityIndex = (city: string, cities: City[]): number =>
  cities.map((e) => e.name.toLowerCase()).indexOf(city.toLowerCase());

export const getData = async (cityId: number): Promise<string> => {
  const response = await fetch(`${API_URL}?ville=${cityId}`,{
  });
  return await response.text();
};

export const parsePrayerTimesFromResponse = (response: string): PrayerTimes => {
  const window = domino.createWindow(response);
  const document = window.document;
  const tds = document.getElementsByTagName("td");

  const prayers: { prayer: PrayerName; time?: string }[] = JSON.parse(
    JSON.stringify(prayersData)
  );

  let j = 0;
  for (let i = 1; i < tds.length && j < prayers.length; i += 2) {
    prayers[j].time = tds[i].textContent.trim();
    j++;
  }

  // Transform array to object and return it
  return prayers.reduce((acc, { prayer, time }) => {
    if (time) {
      acc[prayer] = time;
    }
    return acc;
  }, {} as PrayerTimes);
};


export function tConv24(time24: string): string {
  const date = parse(time24, "HH:mm", new Date());
  return format(date, "hh:mm a");
}

export function getNextPrayer(
  prayerTimes: PrayerTimes,
  now: Date
): { prayer: string; time: string; timeLeft: string } {
  const prayerNames: PrayerName[] = ["Fajr", "Chorouq", "Dhuhr", "Asr", "Maghrib", "Ishae"];

  const prayersWithDates = prayerNames.map((name) => {
    const time = prayerTimes[name];
    const prayerDate = parse(time, "HH:mm", now);
    return { name, date: prayerDate, time };
  });

  let next = prayersWithDates.find((p) => p.date > now);

  if (!next) {
    const firstPrayerName = prayerNames[0];
    const firstTime = prayerTimes[firstPrayerName];
    const tomorrowFajr = addDays(parse(firstTime, "HH:mm", now), 1);
    next = { name: firstPrayerName, date: tomorrowFajr, time: firstTime };
  }

  const diffSec = differenceInSeconds(next.date, now);
  const h = Math.floor(diffSec / 3600);
  const m = Math.floor((diffSec % 3600) / 60);
  const s = diffSec % 60;

  const timeLeft = `${String(h).padStart(2, "0")}:${String(m).padStart(
    2,
    "0"
  )}:${String(s).padStart(2, "0")}`;

  return {
    prayer: next.name,
    time: next.time,
    timeLeft,
  };
}
