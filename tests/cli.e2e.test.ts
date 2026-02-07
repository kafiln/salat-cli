
import { exec } from 'child_process';
import path from 'path';
import util from 'util';
import { describe, expect, it } from 'vitest';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const execPromise = util.promisify(exec);
const appPath = path.join(__dirname, '../src/app.ts');

describe('CLI E2E', () => {
    it('should run and display prayer times for default city', async () => {
        // Running via ts-node to avoid build step dependency in tests
        // using npx ts-node might be slower but works without pre-build
        try {
            const { stdout, stderr } = await execPromise(`node --no-warnings --loader ts-node/esm ${appPath} -1`);
            
            // In CI, network might fail, so we check for either success or network error
            if (stderr && stderr.includes('fetch')) {
                console.warn('Network request failed in CI - skipping validation');
                return;
            }
            
            expect(stderr).toBe('');
            expect(stdout).toContain('Marrakech'); // Default city
            expect(stdout).toContain('Fajr');
            expect(stdout).toContain('Isha');
        } catch (error: any) {
            // If it's a network error, skip the test
            if (error.message?.includes('fetch') || error.message?.includes('ENOTFOUND')) {
                console.warn('Network unavailable in CI - skipping E2E test');
                return;
            }
            throw error;
        }
    }, 15000); // increase timeout for CLI execution

    it('should run and display prayer times for a specific city', async () => {
        try {
            const { stdout, stderr } = await execPromise(`node --no-warnings --loader ts-node/esm ${appPath} "Rabat" -1`);
            
            if (stderr && stderr.includes('fetch')) {
                console.warn('Network request failed in CI - skipping validation');
                return;
            }
            
            expect(stdout).toContain('Rabat');
            expect(stdout).toContain('Fajr');
        } catch (error: any) {
            if (error.message?.includes('fetch') || error.message?.includes('ENOTFOUND')) {
                console.warn('Network unavailable in CI - skipping E2E test');
                return;
            }
            throw error;
        }
    }, 15000);

    it('should handle invalid city gracefully', async () => {
        try {
            const { stdout, stderr } = await execPromise(`node --no-warnings --loader ts-node/esm ${appPath} "InvalidCity" -1`);
            
            if (stderr && stderr.includes('fetch')) {
                console.warn('Network request failed in CI - skipping validation');
                return;
            }
            
            // As per utils.ts, it returns default city (Marrakech) and logs error (NOT_FOUND_ERROR)
            expect(stdout).toContain('Marrakech');
        } catch (error: any) {
            if (error.message?.includes('fetch') || error.message?.includes('ENOTFOUND')) {
                console.warn('Network unavailable in CI - skipping E2E test');
                return;
            }
            throw error;
        }
    }, 15000);
});
