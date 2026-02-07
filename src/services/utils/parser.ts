import { PrayerName, PrayerTimes } from "#services/types";
import domino from "domino";
import prayersData from "../../data/prayers.json" with { type: "json" };

export const parsePrayerTimesFromResponse = (response: string): PrayerTimes => {
  const window = domino.createWindow(response);
  const document = window.document;
  const tds = document.getElementsByTagName("td");

  const prayers: { prayer: PrayerName; time?: string }[] = JSON.parse(
    JSON.stringify(prayersData)
  );

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
  }, {} as PrayerTimes);
};
