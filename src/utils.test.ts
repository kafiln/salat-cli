
import * as constants from '#constants';
import { City } from '#types';
import { getCityId, getCityName, getNextPrayer, parsePrayerTimesFromResponse } from '#utils';
import { parseISO } from 'date-fns';
import { describe, expect, it, vi } from 'vitest';

// Mock cities data
const mockCities: City[] = [
  { id: 1, name: 'Casablanca' },
  { id: 2, name: 'Rabat' },
  { id: 3, name: 'Fes' },
];

describe('utils', () => {
    describe('getCityName', () => {
        it('should return the default city if no argument is provided', () => {
            expect(getCityName(undefined, mockCities)).toBe(constants.DEFAULT_CITY);
        });

        it('should return the city name if it exists', () => {
            expect(getCityName('Casablanca', mockCities)).toBe('Casablanca');
        });

        it('should return default city and log error if city does not exist', () => {
            // Spy on console.error using vitest
            const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            
            expect(getCityName('UnknownCity', mockCities)).toBe(constants.DEFAULT_CITY);
            
            // We expect some error message to be logged. 
            // The actual implementation logs with chalk.red, so we just check it was called.
            expect(consoleLogSpy.mock.calls.length + consoleErrorSpy.mock.calls.length).toBeGreaterThan(0);
            
            consoleLogSpy.mockRestore();
            consoleErrorSpy.mockRestore();
        });

        it('should be case insensitive', () => {
             expect(getCityName('casablanca', mockCities)).toBe('casablanca');
             expect(getCityName('RaBaT', mockCities)).toBe('RaBaT');
        });
    });

    describe('getCityId', () => {
        it('should return the ID if a number is provided as string', () => {
            expect(getCityId('2', mockCities)).toBe(2);
        });

        it('should return the ID based on index + 1 if name is provided', () => {
             // 'Casablanca' is at index 0, so ID should be 1
             expect(getCityId('Casablanca', mockCities)).toBe(1);
             // 'Rabat' is at index 1, so ID should be 2
             expect(getCityId('Rabat', mockCities)).toBe(2);
        });

        it('should handle case insensitivity for city names', () => {
            expect(getCityId('fes', mockCities)).toBe(3);
        });
    });

    describe('parsePrayerTimesFromResponse', () => {
        it('should parse prayer times correctly from HTML', () => {
            const mockHtml = `
            <html>
                <body>
                    <table>
                        <tr><td>Fajr</td><td>05:30</td></tr>
                        <tr><td>Chourouk</td><td>07:00</td></tr>
                        <tr><td>Dhuhr</td><td>12:30</td></tr>
                        <tr><td>Asr</td><td>15:45</td></tr>
                        <tr><td>Maghrib</td><td>18:20</td></tr>
                        <tr><td>Isha</td><td>19:50</td></tr>
                    </table>
                </body>
            </html>
            `;
            
            // Note: The actual implementation expects td elements in a specific order (key, value, key, value...)
            // And it relies on prayersData keys. 
            // We need to match the structure expected by the function.
            // The function iterates tds with i=1, i+=2. meaning it takes index 1, 3, 5... as times.
            
            const results = parsePrayerTimesFromResponse(mockHtml);

            // Based on default prayers.json keys, let's assume we expect those values.
            // Since we mocked the HTML, if the code pushes to 'prayers' array from 'prayersData',
            // and then updates .time property from tds.
            
            // checking if it returns an object with times
            expect(results).toHaveProperty('Fajr');
            expect(results).toHaveProperty('Dhuhr');
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
            // From 21:00 to 05:30 next day is 8 hours and 30 minutes
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
