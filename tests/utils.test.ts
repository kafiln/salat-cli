import { describe, expect, it } from 'vitest';
import { PrayerTimes } from '../src/services/types';
import { getNextPrayer, tConv24 } from '../src/services/utils';

describe('utils', () => {
  describe('tConv24', () => {
    it('converts 24h time to 12h time with AM/PM', () => {
      expect(tConv24('14:30')).toBe('02:30 PM');
      expect(tConv24('05:15')).toBe('05:15 AM');
      expect(tConv24('12:00')).toBe('12:00 PM');
      expect(tConv24('00:00')).toBe('12:00 AM');
    });
  });

  describe('getNextPrayer', () => {
    const prayerTimes: PrayerTimes = {
      Fajr: "05:00",
      Chorouq: "06:30",
      Dhuhr: "12:30",
      Asr: "15:45",
      Maghrib: "18:20",
      Ishae: "19:50"
    };

    it('returns the next prayer within the same day', () => {
      const now = new Date('2024-01-01T10:00:00');
      const result = getNextPrayer(prayerTimes, now);
      expect(result.prayer).toBe('Dhuhr');
      expect(result.time).toBe('12:30');
      expect(result.timeLeft).toBe('02:30:00');
    });

    it('returns the first prayer of the next day if all prayers for today have passed', () => {
      const now = new Date('2024-01-01T21:00:00');
      const result = getNextPrayer(prayerTimes, now);
      expect(result.prayer).toBe('Fajr');
      expect(result.time).toBe('05:00');
      expect(result.timeLeft).toBe('08:00:00');
    });

    it('returns correct timeLeft with seconds', () => {
        const now = new Date('2024-01-01T12:00:15');
        const result = getNextPrayer(prayerTimes, now);
        expect(result.prayer).toBe('Dhuhr');
        expect(result.timeLeft).toBe('00:29:45');
    });
  });
});
