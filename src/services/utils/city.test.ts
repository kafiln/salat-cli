import { describe, expect, it, vi } from 'vitest';
import * as constants from '../constants.js';
import { City } from '../types.js';
import { getCityId, getCityIndex, getCityName } from './city.js';

// Mock cities data
const mockCities: City[] = [
  { id: 1, name: 'Casablanca' },
  { id: 2, name: 'Rabat' },
  { id: 3, name: 'Fes' },
];

describe('city utils', () => {
    describe('getCityName', () => {
        it('should return the default city if no argument is provided', () => {
            expect(getCityName(undefined, mockCities)).toBe(constants.DEFAULT_CITY);
        });

        it('should return the city name if it exists', () => {
            expect(getCityName('Casablanca', mockCities)).toBe('Casablanca');
        });

        it('should return default city and log error if city does not exist', () => {
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            
            expect(getCityName('UnknownCity', mockCities)).toBe(constants.DEFAULT_CITY);
            expect(consoleErrorSpy).toHaveBeenCalledWith(constants.NOT_FOUND_ERROR);
            
            consoleErrorSpy.mockRestore();
        });

        it('should be case insensitive', () => {
             expect(getCityName('casablanca', mockCities)).toBe('casablanca');
             expect(getCityName('RaBaT', mockCities)).toBe('RaBaT');
        });
    });

    describe('getCityId', () => {
        it('should return the ID if a number is provided as string within range', () => {
            expect(getCityId('2', mockCities)).toBe(2);
        });

        it('should return ID from index if number is out of range', () => {
             // 4 is out of range (mockCities.length is 3)
             // But if we pass '4', getCityIndex('4', mockCities) returns -1.
             // So it returns -1 + 1 = 0.
             expect(getCityId('4', mockCities)).toBe(0);
        });

        it('should return the ID based on index + 1 if name is provided', () => {
             expect(getCityId('Casablanca', mockCities)).toBe(1);
             expect(getCityId('Rabat', mockCities)).toBe(2);
        });

        it('should handle case insensitivity for city names', () => {
            expect(getCityId('fes', mockCities)).toBe(3);
        });

        it('should return 0 if city name is not found', () => {
            expect(getCityId('Unknown', mockCities)).toBe(0);
        });
    });

    describe('getCityIndex', () => {
        it('should return the correct index for a city name', () => {
            expect(getCityIndex('Casablanca', mockCities)).toBe(0);
            expect(getCityIndex('Rabat', mockCities)).toBe(1);
        });

        it('should be case insensitive', () => {
            expect(getCityIndex('casablanca', mockCities)).toBe(0);
        });

        it('should return -1 if city is not found', () => {
            expect(getCityIndex('NonExistent', mockCities)).toBe(-1);
        });
    });
});
