const axios = require("axios");
const { JSDOM } = require("jsdom");

const prayers = require("./data/prayers.json");
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
      prayers[j].Time = tds[i].textContent.trim();
      j++;
    }
  }
  // Transorm array to object and return it
  return prayers.reduce((acc, { Prayer, Time }) => {
    acc[Prayer] = Time;
    return acc;
  }, {});

};

function tConv24(time24) {
  var ts = time24;
  var H = +ts.substr(0, 2);
  var h = (H % 12) || 12;
  h = (h < 10)?("0"+h):h;  // leading 0 at the left for 1 digit hours
  var ampm = H < 12 ? ` ${chalk.hex('#a6c9de').visible('AM')}` : ` ${chalk.hex('#debfa6').visible('PM')}`;
  ts = h + ts.substr(2, 3) + ampm;
  return ts;
};

module.exports.displayResult = (prayers, city) => {
  if (prayers) {
    console.log(
      ` 🧭 ${city}, Morocco\n\n 📆 ${new Date().toDateString()}`
    );
    console.log(`
 ◽ ${chalk.cyan('Fajr')}     -->   ${chalk.green(tConv24(prayers.Fajr))}
 ◽ ${chalk.cyan('Chorouq')}  -->   ${chalk.green(tConv24(prayers.Chorouq))}
 ◽ ${chalk.cyan('Dhuhr')}    -->   ${chalk.green(tConv24(prayers.Dhuhr))}
 ◽ ${chalk.cyan('Asr')}      -->   ${chalk.green(tConv24(prayers.Asr))}
 ◽ ${chalk.cyan('Maghrib')}  -->   ${chalk.green(tConv24(prayers.Maghrib))}
 ◽ ${chalk.cyan('Ishae')}    -->   ${chalk.green(tConv24(prayers.Ishae))}`
);
  }
};
