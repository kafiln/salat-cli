const { JSDOM } = require("jsdom");

const prayers = require("./data/prayers.json");
const chalk = require("chalk");
const { API_URL, DEFAULT_CITY } = require("./constants");
const { NOT_FOUND_ERROR } = require("./constants");
const fetch = require("node-fetch");

const error = (msg) => console.log(chalk.red(msg));

const getCityId = (arg, cities) => {
  const parsed = parseInt(arg);
  if (parsed && cities.length >= parsed) {
    return parsed;
  }
  return getCityIndex(arg, cities) + 1;
};

module.exports.getCityId = getCityId;

module.exports.getCityName = (arg, cities) => {
  if (arg == null) return DEFAULT_CITY;
  const index = getCityIndex(arg, cities);
  if (index == -1) {
    error(NOT_FOUND_ERROR);
    return DEFAULT_CITY;
  }
  return arg;
};

const getCityIndex = (city, cities) =>
  cities.map((e) => e.name.toLowerCase()).indexOf(city.toLowerCase());

module.exports.getData = async (cityId) => {
  const response = await fetch(`${API_URL}?ville=${cityId}`);
  return await response.text();
};

module.exports.parsePrayerTimesFromResponse = (response) => {
  const dom = new JSDOM(response);
  const tds = dom.window.document.getElementsByTagName("td");

  let j = 0;
  for (let i = 1; i < tds.length; i += 2) {
    prayers[j].time = tds[i].textContent.trim();
    j++;
  }

  // Transorm array to object and return it
  return prayers.reduce((acc, { prayer, time }) => {
    acc[prayer] = time;
    return acc;
  }, {});
};

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

module.exports.displayResult = (prayers, city) => {
  if (!prayers) return;
  if (prayers) {
    console.log(` 🧭 ${city}, Morocco\n\n 📆 ${new Date().toDateString()}\n`);
    Object.keys(prayers).forEach((key) => {
      console.log(
        ` ${chalk.cyan(key.padEnd(7, " "))} --> ${chalk.green(
          tConv24(prayers[key])
        )}`
      );
    });
    console.log("\n");
  }
};
