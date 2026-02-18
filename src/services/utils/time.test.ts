import { parseISO } from 'date-fns';
import { describe, expect, it } from 'vitest';
import { getImsakTime, getNextPrayer, tConv24 } from './time.js';

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
});
