#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Project's dependencies
const chalk_1 = __importDefault(require("chalk"));
const utils_1 = require("./utils");
// Project's data
const constants_1 = require("./constants");
const cities_json_1 = __importDefault(require("./data/cities.json"));
// Setting up localStorage
const node_localstorage_1 = require("node-localstorage");
const args = process.argv;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// Logging function
const green = (msg) => console.log(chalk_1.default.green(msg));
// Cast citiesData to City[] properly
const cities = cities_json_1.default;
const localStorage = new node_localstorage_1.LocalStorage(constants_1.LOCAL_STORAGE_PATH);
const cityNameArg = args[2];
const cityName = (0, utils_1.getCityName)(cityNameArg, cities);
// Convert string ID to number since getCityId returns number and getData expects number
const cityId = (0, utils_1.getCityId)(cityName, cities);
const main = async () => {
    // Printing a banner ('cause I'm cool and I can do it XD)
    green(constants_1.BANNER);
    const storageKey = `${cityName.toLowerCase()}_${new Date().toLocaleDateString()}`;
    let item = localStorage.getItem(storageKey);
    // Disable localStorage for local development
    if (process.env.NODE_ENV === "development") {
        console.log("development mode: localStorage is disabled");
        item = null;
    }
    let prayers = null;
    if (item) {
        prayers = JSON.parse(item);
    }
    else {
        try {
            const data = await (0, utils_1.getData)(cityId);
            prayers = (0, utils_1.parsePrayerTimesFromResponse)(data);
            localStorage.setItem(storageKey, JSON.stringify(prayers));
        }
        catch (ex) {
            //TODO: Use a more descriptive error message
            console.error("Something went wrong!");
            console.log(ex);
            return;
        }
    }
    console.clear();
    (0, utils_1.displayResult)(prayers, cityName);
};
(async () => {
    await main();
})();
