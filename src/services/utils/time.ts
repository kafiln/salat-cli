import { PrayerName, PrayerTimes } from "#services/types";
import { addDays, format, intervalToDuration, parse, subMinutes } from "date-fns";

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
