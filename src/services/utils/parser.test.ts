import { describe, expect, it } from 'vitest';
import { parsePrayerTimesFromResponse } from './parser.js';

describe('parser utils', () => {
    describe('parsePrayerTimesFromResponse', () => {
        it('should parse prayer times correctly from HTML', () => {
            const mockHtml = `
            <html>
                <body>
                    <table>
                        <tr><td>Ignored</td><td>05:30</td></tr>
                        <tr><td>Ignored</td><td>07:00</td></tr>
                        <tr><td>Ignored</td><td>12:30</td></tr>
                        <tr><td>Ignored</td><td>15:45</td></tr>
                        <tr><td>Ignored</td><td>18:20</td></tr>
                        <tr><td>Ignored</td><td>19:50</td></tr>
                    </table>
                </body>
            </html>
            `;
            
            const results = parsePrayerTimesFromResponse(mockHtml);

            expect(results.Fajr).toBe('05:30');
            expect(results.Chorouq).toBe('07:00');
            expect(results.Dhuhr).toBe('12:30');
            expect(results.Asr).toBe('15:45');
            expect(results.Maghrib).toBe('18:20');
            expect(results.Ishae).toBe('19:50');
        });

        it('should handle empty or invalid HTML and return empty object', () => {
            const results = parsePrayerTimesFromResponse('<html></html>');
            expect(results).toEqual({});
        });
    });
});
