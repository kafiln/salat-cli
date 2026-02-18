import { PrayerName, PrayerTimes } from "#services/types";
import { addDays, differenceInSeconds, format, intervalToDuration, parse, subDays, subMinutes } from "date-fns";

export function tConv24(time24: string): string {
  const date = parse(time24, "HH:mm", new Date());
  return format(date, "hh:mm a");
}

export function getImsakTime(fajr: string): string {
  const date = parse(fajr, "HH:mm", new Date());
  const imsakDate = subMinutes(date, 10);
  return format(imsakDate, "HH:mm");
}

export function getNextPrayer(
  prayerTimes: PrayerTimes,
  now: Date
): { prayer: string; time: string; timeLeft: string } {
  const prayerNames: PrayerName[] = ["Fajr", "Chorouq", "Dhuhr", "Asr", "Maghrib", "Ishae"];

  const prayersWithDates = prayerNames.map((name) => ({
    name,
    time: prayerTimes[name],
    date: parse(prayerTimes[name], "HH:mm", now),
  }));

  const next = prayersWithDates.find((p) => p.date > now) || {
    ...prayersWithDates[0],
    date: addDays(prayersWithDates[0].date, 1),
  };

  const duration = intervalToDuration({ start: now, end: next.date });
  const timeLeft = [duration.hours, duration.minutes, duration.seconds]
    .map((v) => String(v ?? 0).padStart(2, "0"))
    .join(":");

  return {
    prayer: next.name,
    time: next.time,
    timeLeft,
  };
}

export function getPrayerProgress(
  prayerTimes: PrayerTimes,
  currentTime: Date,
  nextPrayer: string
) {
  const prayerOrder: PrayerName[] = ["Fajr", "Chorouq", "Dhuhr", "Asr", "Maghrib", "Ishae"];
  const nextIndex = prayerOrder.indexOf(nextPrayer as PrayerName);
  const prevIndex = (nextIndex - 1 + prayerOrder.length) % prayerOrder.length;
  const prevPrayerName = prayerOrder[prevIndex];

  let prevDate = parse(prayerTimes[prevPrayerName], "HH:mm", currentTime);
  let nextDate = parse(prayerTimes[nextPrayer as PrayerName], "HH:mm", currentTime);

  if (nextPrayer === "Fajr" && currentTime.getHours() >= 12) {
    nextDate = addDays(nextDate, 1);
  } else if (nextPrayer === "Fajr" && currentTime.getHours() < 12) {
    prevDate = subDays(parse(prayerTimes.Ishae, "HH:mm", currentTime), 1);
  }

  const totalSeconds = differenceInSeconds(nextDate, prevDate);
  const elapsedSeconds = differenceInSeconds(currentTime, prevDate);
  const progress = Math.max(0, Math.min(1, elapsedSeconds / totalSeconds));

  return progress;
}

export type RamadanData = 
  | { type: "fasting"; progress: number }
  | { type: "imsak"; timeLeft: string }
  | null;

export function getRamadanData(
  prayerTimes: PrayerTimes,
  tomorrowTimes: PrayerTimes | null,
  currentTime: Date
): RamadanData {
  const fajrToday = parse(prayerTimes.Fajr, "HH:mm", currentTime);
  const maghribToday = parse(prayerTimes.Maghrib, "HH:mm", currentTime);
  const isFasting = currentTime >= fajrToday && currentTime < maghribToday;

  if (isFasting) {
    const totalFastingSeconds = differenceInSeconds(maghribToday, fajrToday);
    const elapsedFastingSeconds = differenceInSeconds(currentTime, fajrToday);
    const fastingProgress = Math.max(0, Math.min(1, elapsedFastingSeconds / totalFastingSeconds));
    return { type: "fasting", progress: fastingProgress };
  }

  if (tomorrowTimes) {
    let nextImsakDate: Date;
    const imsakStr = getImsakTime(prayerTimes.Fajr);
    const todayImsak = parse(imsakStr, "HH:mm", currentTime);

    if (currentTime < todayImsak) {
      nextImsakDate = todayImsak;
    } else {
      const tomorrowImsakStr = getImsakTime(tomorrowTimes.Fajr);
      nextImsakDate = parse(tomorrowImsakStr, "HH:mm", addDays(currentTime, 1));
    }

    const duration = intervalToDuration({ start: currentTime, end: nextImsakDate });
    const timeLeft = [duration.hours, duration.minutes, duration.seconds]
      .map((v) => String(v ?? 0).padStart(2, "0"))
      .join(":");

    return { type: "imsak", timeLeft };
  }

  return null;
}
