#!/usr/bin/env node

// Project's dependencies
const chalk = require("chalk");
const args = process.argv;
const {
  getCityId,
  getCityName,
  displayResult,
  getData,
  parsePrayerTimesFromResponse,
} = require("./utils.js");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Logging functioin
const green = (msg) => console.log(chalk.green(msg));

// Project's data
const { BANNER, LOCAL_STORAGE_PATH } = require("./constants");
const cities = require("./data/cities.json");

// Setting up localStorage
const { LocalStorage } = require("node-localstorage");
localStorage = new LocalStorage(LOCAL_STORAGE_PATH);

const cityName = getCityName(args[2], cities);
const cityId = getCityId(cityName, cities);

const main = async () => {
  // Prinitng a banner ('cause I'm cool and I can do it XD)
  green(BANNER);

  const storageKey = `${cityName.toLowerCase()}_${new Date().toLocaleDateString()}`;
  let item = localStorage.getItem(storageKey);

  // Disable localStorage for local development
  if (process.env.NODE_ENV === "development") {
    console.log("development mode: localStorage is disabled");
    item = null;
  }
  let prayers;

  if (item) {
    prayers = JSON.parse(item);
  } else {
    try {
      prayers = parsePrayerTimesFromResponse(await getData(cityId));
      localStorage.setItem(storageKey, JSON.stringify(prayers));
    } catch (ex) {
      //TODO: Use a more descriptif error message
      console.error("Something went wrong!");
      console.log(ex);
      // console.log(ex);
      return;
    }
  }

  console.clear();
  displayResult(prayers, cityName);
};

(async () => {
  await main();
})();
