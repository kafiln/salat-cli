import { API_URL, DEFAULT_CITY, NOT_FOUND_ERROR } from "#constants";
import { City, PrayerDef, PrayerTimes } from "#types";
import chalk from "chalk";
import domino from "domino";
import fetch from "node-fetch";
import prayersData from "./data/prayers.json" with { type: "json" };

const error = (msg: string) => console.error(chalk.red(msg));

export const getCityName = (arg: string | undefined, cities: City[]): string => {
  if (arg == null) return DEFAULT_CITY;
  const index = getCityIndex(arg, cities);
  if (index === -1) {
    error(NOT_FOUND_ERROR);
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

  const prayers: (PrayerDef & { time?: string })[] = JSON.parse(
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

function tConv24(time24: string): string {
  const [hours, minutes] = time24.split(":");
  const hour = Number(hours);
  const formattedHour = hour % 12 || 12;
  const formattedHourWithZero = (formattedHour + "").padStart(2, "0");
  const formattedMinutes = minutes.padStart(2, "0");
  const formattedTime = `${formattedHourWithZero}:${formattedMinutes}`;
  const ampm = hour < 12 ? "AM" : "PM";
  return `${formattedTime} ${ampm}`;
}

export const displayResult = (
  prayers: PrayerTimes | undefined | null,
  city: string
) => {
  if (!prayers) return;
  console.log(` 🧭 ${city}, Morocco\n\n 📆 ${new Date().toDateString()}\n`);
  Object.keys(prayers).forEach((key) => {
    console.log(
      ` ${chalk.cyan(key.padEnd(7, " "))} --> ${chalk.green(
        tConv24(prayers[key])
      )}`
    );
  });
  console.log("\n");
};
