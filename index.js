#!/usr/bin/env node

// Project's dependencies
const request = require("request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const args = process.argv;

// Project's data
const cities = require("./data/fr/cities_fr.json");
const prayers = require("./data/fr/prayers_fr.json");
const { API_URL, DEFAULT_CITY } = require("./constants");

const getArgs = (arg, cities) => {
  const parsed = parseInt(arg);
  if (parsed && cities.length >= parsed) {
    return parsed;
  }
  const index = cities
    .map(e => e.name.toLowerCase())
    .indexOf(arg.toLowerCase());
  if (index != -1) {
    return index + 1;
  } else {
    console.error(`City ${arg} not found in liste`);
  }

  return null;
};

//TODO: This should be an arg
const cityId =
  (args[2] ? getArgs(args[2], cities) : DEFAULT_CITY) || DEFAULT_CITY;

request(`${API_URL}?ville=${cityId}`, { json: true }, (err, res, body) => {
  if (err) {
    return console.log(err);
  }

  const dom = new JSDOM(`${body}`);
  const tds = dom.window.document.getElementsByTagName("td");
  const prayers = getPrayerTimes(tds);

  if (prayers) {
    const city = cities.filter(e => e.id == cityId)[0].name;
    if (city) {
      console.log(
        `Prayer's time in ${city}, Morocco\nDate : ${new Date().toDateString()}`
      );
    }
    console.table(prayers);
  }
});

let getPrayerTimes = function(tds) {
  var j = 0;
  for (var i = 0; i < tds.length; i++) {
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
