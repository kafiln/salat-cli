const request = require('request');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const cities = require('./cities_fr.json');
const prayers = require('./prayers_fr.json');

//TODO: Put this in conf file
const API = "http://www.habous.gov.ma/horaire%20de%20priere/horaire-pub.php";

//TODO: This should be an arg
const cityId = 80;

// console.log(cities);

request(`${API}?ville=${cityId}`, { json: true }, (err, res, body) => {

    if (err) { return console.log(err); }

    const dom = new JSDOM(`${body}`);
    const tds = dom.window.document.getElementsByTagName('td');
    const prayers = getPrayerTimes(tds)

    if (prayers) {
        const city = cities.filter(e => e.id == cityId)[0].name;
        if (city) {
            console.log(`Prayer's time in ${city} for ${new Date().toDateString()}`)
        }
        console.table(prayers);
    }
});


let getPrayerTimes = function (tds) {

    var j = 0;
    for (var i = 0; i < tds.length; i++) {
        if (i % 2) {
            prayers[j].time = tds[i].textContent.trim();
            j++;
        }
    }
    // Transorm array to object and return it
    return prayers.reduce((acc, { name, time }) => { acc[name] = time; return acc }, {});

}