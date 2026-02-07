#!/usr/bin/env node

// Project's dependencies
import {
  displayResult,
  getCityId,
  getCityName,
  getData,
  parsePrayerTimesFromResponse,
} from "#utils";
import chalk from "chalk";

// Project's data
import { BANNER, LOCAL_STORAGE_PATH } from "#constants";
import { City, PrayerTimes } from "#types";
import citiesData from "./data/cities.json" with { type: "json" };

// Setting up localStorage
import { LocalStorage } from "node-localstorage";

const args = process.argv;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Logging function
const green = (msg: string) => console.log(chalk.green(msg));

// Cast citiesData to City[] properly
const cities: City[] = citiesData as City[];

const localStorage = new LocalStorage(LOCAL_STORAGE_PATH);

const cityNameArg = args[2];
const cityName = getCityName(cityNameArg, cities);
// Convert string ID to number since getCityId returns number and getData expects number
const cityId = getCityId(cityName, cities);

const main = async () => {
  // Printing a banner ('cause I'm cool and I can do it XD)
  green(BANNER);

  const storageKey = `${cityName.toLowerCase()}_${new Date().toLocaleDateString()}`;
  let item = localStorage.getItem(storageKey);

  // Disable localStorage for local development
  if (process.env.NODE_ENV === "development") {
    console.log("development mode: localStorage is disabled");
    item = null;
  }
  let prayers: PrayerTimes | null = null;

  if (item) {
    prayers = JSON.parse(item);
  } else {
    try {
      const data = await getData(cityId);
      prayers = parsePrayerTimesFromResponse(data);
      localStorage.setItem(storageKey, JSON.stringify(prayers));
    } catch (ex) {
      //TODO: Use a more descriptive error message
      console.error("Something went wrong!");
      console.log(ex);
      return;
    }
  }

  console.clear();
  displayResult(prayers, cityName);
};

(async () => {
  await main();
})();
