"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayResult = exports.parsePrayerTimesFromResponse = exports.getData = exports.getCityId = exports.getCityName = void 0;
const chalk_1 = __importDefault(require("chalk"));
const domino_1 = __importDefault(require("domino"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const constants_1 = require("./constants");
const prayers_json_1 = __importDefault(require("./data/prayers.json"));
const error = (msg) => console.log(chalk_1.default.red(msg));
const getCityName = (arg, cities) => {
    if (arg == null)
        return constants_1.DEFAULT_CITY;
    const index = getCityIndex(arg, cities);
    if (index === -1) {
        error(constants_1.NOT_FOUND_ERROR);
        return constants_1.DEFAULT_CITY;
    }
    return arg;
};
exports.getCityName = getCityName;
const getCityId = (arg, cities) => {
    const parsed = parseInt(arg);
    if (parsed && cities.length >= parsed) {
        return parsed;
    }
    return getCityIndex(arg, cities) + 1;
};
exports.getCityId = getCityId;
const getCityIndex = (city, cities) => cities.map((e) => e.name.toLowerCase()).indexOf(city.toLowerCase());
const getData = async (cityId) => {
    const response = await (0, node_fetch_1.default)(`${constants_1.API_URL}?ville=${cityId}`);
    return await response.text();
};
exports.getData = getData;
const parsePrayerTimesFromResponse = (response) => {
    const window = domino_1.default.createWindow(response);
    const document = window.document;
    const tds = document.getElementsByTagName("td");
    const prayers = JSON.parse(JSON.stringify(prayers_json_1.default));
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
    }, {});
};
exports.parsePrayerTimesFromResponse = parsePrayerTimesFromResponse;
function tConv24(time24) {
    const [hours, minutes] = time24.split(":");
    const hour = Number(hours);
    const formattedHour = hour % 12 || 12;
    const formattedHourWithZero = (formattedHour + "").padStart(2, "0");
    const formattedMinutes = minutes.padStart(2, "0");
    const formattedTime = `${formattedHourWithZero}:${formattedMinutes}`;
    const ampm = hour < 12 ? "AM" : "PM";
    return `${formattedTime} ${ampm}`;
}
const displayResult = (prayers, city) => {
    if (!prayers)
        return;
    console.log(` 🧭 ${city}, Morocco\n\n 📆 ${new Date().toDateString()}\n`);
    Object.keys(prayers).forEach((key) => {
        console.log(` ${chalk_1.default.cyan(key.padEnd(7, " "))} --> ${chalk_1.default.green(tConv24(prayers[key]))}`);
    });
    console.log("\n");
};
exports.displayResult = displayResult;
