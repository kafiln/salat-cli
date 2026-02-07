import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as constants from '../constants.js';
import { getData } from './api.js';

describe('api utils', () => {
    describe('getData', () => {
        beforeEach(() => {
            vi.stubGlobal('fetch', vi.fn());
        });

        it('should fetch data from the correct URL', async () => {
            const mockResponse = 'mock html content';
            (vi.mocked(fetch)).mockResolvedValue({
                text: async () => mockResponse,
            } as Response);

            const result = await getData(1);
            
            expect(fetch).toHaveBeenCalledWith(`${constants.API_URL}?ville=1`);
            expect(result).toBe(mockResponse);
        });

        it('should throw error if fetch fails', async () => {
            (vi.mocked(fetch)).mockRejectedValue(new Error('Network error'));

            await expect(getData(1)).rejects.toThrow('Network error');
        });
    });
});
