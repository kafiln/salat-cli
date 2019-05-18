#!/usr/bin/env node

// Project's dependencies
const { JSDOM } = require("jsdom");
const chalk = require("chalk");
const args = process.argv;
const {
  getCityId,
  getCityName,
  displayResult,
  getData,
  parsePrayerTimesFromResponse,
  banner
} = require("./utils.js");

const { BANNER } = require("./constants");

// Login functioin
const green = msg => console.log(chalk.green(msg));

// Prinitng the banner ('cause I'm cool and I can do it XD)
green(BANNER);

// Project's data
const cities = require("./data/fr/cities_fr.json");

const cityName = getCityName(args[2], cities);
const cityId = getCityId(cityName, cities);

const main = async id => {
  try {
    const response = await getData(id);
    const dom = new JSDOM(`${response.data}`);
    const tds = dom.window.document.getElementsByTagName("td");
    const prayers = parsePrayerTimesFromResponse(tds);
    displayResult(prayers, cityName);
  } catch (ex) {
    //TODO: Use a more descriptif error message
    console.error("Someting bad happened");
    console.log(ex);
  }
};

main(cityId);
