import { parseISO } from 'date-fns';
import { describe, expect, it } from 'vitest';
import { getImsakTime, getNextPrayer, getPrayerProgress, getRamadanData, tConv24 } from './time.js';

describe('time utils', () => {
    describe('tConv24', () => {
        it('should convert 24h time to 12h format with AM/PM', () => {
            expect(tConv24('13:30')).toBe('01:30 PM');
            expect(tConv24('05:15')).toBe('05:15 AM');
            expect(tConv24('00:00')).toBe('12:00 AM');
            expect(tConv24('12:00')).toBe('12:00 PM');
        });
    });

    describe('getImsakTime', () => {
        it('should return 10 minutes before Fajr', () => {
            expect(getImsakTime('05:30')).toBe('05:20');
            expect(getImsakTime('00:05')).toBe('23:55');
            expect(getImsakTime('00:00')).toBe('23:50');
        });
    });

    describe('getNextPrayer', () => {
        const prayerTimes = {
            Fajr: "05:30",
            Chorouq: "07:00",
            Dhuhr: "12:30",
            Asr: "15:45",
            Maghrib: "18:20",
            Ishae: "19:50"
        };

        it('should return Fajr if current time is before Fajr', () => {
            const now = parseISO('2026-02-07T04:00:00');
            const result = getNextPrayer(prayerTimes, now);
            expect(result.prayer).toBe('Fajr');
            expect(result.time).toBe('05:30');
            expect(result.timeLeft).toBe('01:30:00');
        });

        it('should return Dhuhr if current time is between Chorouq and Dhuhr', () => {
            const now = parseISO('2026-02-07T10:00:00');
            const result = getNextPrayer(prayerTimes, now);
            expect(result.prayer).toBe('Dhuhr');
            expect(result.time).toBe('12:30');
            expect(result.timeLeft).toBe('02:30:00');
        });

        it('should return tomorrow Fajr if current time is after Ishae', () => {
            const now = parseISO('2026-02-07T21:00:00');
            const result = getNextPrayer(prayerTimes, now);
            expect(result.prayer).toBe('Fajr');
            expect(result.time).toBe('05:30');
            expect(result.timeLeft).toBe('08:30:00');
        });

        it('should handle seconds correctly in timeLeft', () => {
            const now = parseISO('2026-02-07T12:29:45');
            const result = getNextPrayer(prayerTimes, now);
            expect(result.prayer).toBe('Dhuhr');
            expect(result.timeLeft).toBe('00:00:15');
        });
    });

    describe('getPrayerProgress', () => {
        const prayerTimes = {
            Fajr: "05:00",
            Chorouq: "06:30",
            Dhuhr: "12:30",
            Asr: "15:45",
            Maghrib: "18:20",
            Ishae: "19:50"
        };

        it('should return correct progress during the day', () => {
            const now = parseISO('2026-02-07T12:00:00');
            // From Chorouq (06:30) to Dhuhr (12:30) is 6h. 
            // Current is 12:00, which is 5.5h after 06:30.
            // 5.5 / 6 = 0.9166...
            const progress = getPrayerProgress(prayerTimes, now, 'Dhuhr');
            expect(progress).toBeCloseTo(0.917, 3);
        });

        it('should handle progress before Fajr (after midnight)', () => {
            const now = parseISO('2026-02-07T03:00:00');
            // From Ishae (yesterday 19:50) to Fajr (today 05:00) 
            // Total seconds: 19:50 to 05:00 = 9h 10m = 33000s
            // Now is 03:00, which is 7h 10m after 19:50 = 25800s
            // 25800 / 33000 = 0.7818...
            const progress = getPrayerProgress(prayerTimes, now, 'Fajr');
            expect(progress).toBeCloseTo(0.782, 3);
        });

        it('should handle progress after Ishae (before midnight)', () => {
            const now = parseISO('2026-02-07T21:00:00');
            // From Ishae (2026-02-07 19:50) to Fajr (2026-02-08 05:00)
            // Total seconds: 19:50 to 05:00 = 9h 10m = 33000s
            // Now is 21:00, which is 1h 10m after 19:50 = 4200s
            // 4200 / 33000 = 0.1272...
            const progress = getPrayerProgress(prayerTimes, now, 'Fajr');
            expect(progress).toBeCloseTo(0.127, 3);
        });
    });

    describe('getRamadanData', () => {
        const prayerTimes = {
            Fajr: "05:00",
            Chorouq: "06:30",
            Dhuhr: "12:30",
            Asr: "15:45",
            Maghrib: "18:20",
            Ishae: "19:50"
        };
        const tomorrowTimes = { ...prayerTimes };

        it('should return fasting data when current time is between Fajr and Maghrib', () => {
            const now = parseISO('2026-02-07T12:00:00');
            const data = getRamadanData(prayerTimes, tomorrowTimes, now);
            expect(data).toEqual({
                type: 'fasting',
                // (12:00 - 05:00) / (18:20 - 05:00) = 7h / 13h 20m = 420m / 800m = 0.525
                progress: 0.525
            });
        });

        it('should return imsak data before today Fajr', () => {
            const now = parseISO('2026-02-07T04:00:00');
            const data = getRamadanData(prayerTimes, tomorrowTimes, now);
            // Imsak is 04:50. Now is 04:00. Time left is 50m.
            expect(data).toEqual({
                type: 'imsak',
                timeLeft: '00:50:00'
            });
        });

        it('should return tomorrow imsak data after Maghrib', () => {
            const now = parseISO('2026-02-07T22:00:00');
            const data = getRamadanData(prayerTimes, tomorrowTimes, now);
            // Tomorrow Imsak is 2026-02-08 04:50. 
            // From 22:00 to 04:50 is 6h 50m.
            expect(data).toEqual({
                type: 'imsak',
                timeLeft: '06:50:00'
            });
        });
    });
});
