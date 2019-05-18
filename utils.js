const axios = require("axios");
const { JSDOM } = require("jsdom");

const prayers = require("./data/fr/prayers_fr.json");
const chalk = require("chalk");
const { API_URL, DEFAULT_CITY } = require("./constants");
const { NOT_FOUND_ERROR } = require("./constants");

const error = msg => console.log(chalk.red(msg));

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
  }
  return index == -1 ? DEFAULT_CITY : arg;
};

const getCityIndex = (city, cities) =>
  cities.map(e => e.name.toLowerCase()).indexOf(city.toLowerCase());

module.exports.getData = async cityId =>
  await axios.get(`${API_URL}?ville=${cityId}`);

module.exports.parsePrayerTimesFromResponse = response => {
  const dom = new JSDOM(`${response.data}`);
  const tds = dom.window.document.getElementsByTagName("td");

  let j = 0;
  for (let i = 0; i < tds.length; i++) {
    if (i % 2) {
      prayers[j].time = tds[i].textContent.trim();
      j++;
    }
  }
  // Transorm array to object and return it
  return prayers.reduce((acc, { name, time }) => {
    acc[name] = time;
    return acc;
  }, {});
};

module.exports.displayResult = (prayers, city) => {
  if (prayers) {
    console.log(
      `Prayer's time in ${city}, Morocco\nOn the day : ${new Date().toDateString()}`
    );
    console.table(prayers);
  }
};
