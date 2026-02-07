
import { exec } from 'child_process';
import path from 'path';
import util from 'util';
import { describe, expect, it } from 'vitest';

const execPromise = util.promisify(exec);
const appPath = path.join(__dirname, '../src/app.ts');

describe('CLI E2E', () => {
    it('should run and display prayer times for default city', async () => {
        // Running via ts-node to avoid build step dependency in tests
        // using npx ts-node might be slower but works without pre-build
        const { stdout, stderr } = await execPromise(`npx ts-node ${appPath}`);
        
        expect(stderr).toBe('');
        expect(stdout).toContain('Marrakech'); // Default city
        expect(stdout).toContain('Fajr');
        expect(stdout).toContain('Isha');
    }, 10000); // increase timeout for CLI execution

    it('should run and display prayer times for a specific city', async () => {
        const { stdout } = await execPromise(`npx ts-node ${appPath} "Rabat"`);
        
        expect(stdout).toContain('Rabat');
        expect(stdout).toContain('Fajr');
    }, 10000);

    it('should handle invalid city gracefully', async () => {
        const { stdout } = await execPromise(`npx ts-node ${appPath} "InvalidCity"`);
        
        // As per utils.ts, it returns default city (Casablanca) and logs error (NOT_FOUND_ERROR)
        // Note: The error is logged to console.log, so it might appear in stdout or just be visible.
        // utils.ts: error(NOT_FOUND_ERROR) -> console.log(chalk.red(msg))
        
        expect(stdout).toContain('Marrakech');
        // We might want to check for the error message if it's printed to stdout
        // BUT utils.ts uses console.log for error as well.
    }, 10000);
});
