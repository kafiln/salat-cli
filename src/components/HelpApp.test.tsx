import { render } from 'ink-testing-library';
import { describe, expect, it } from 'vitest';
import HelpApp from './HelpApp.js';

describe('HelpApp', () => {
	it('should render help guide', () => {
		const { lastFrame } = render(<HelpApp />);
		
		expect(lastFrame()).toContain('SALAT CLI GUIDE');
		expect(lastFrame()).toContain('Usage:');
		expect(lastFrame()).toContain('Commands:');
		expect(lastFrame()).toContain('Options:');
	});

	it('should list available commands', () => {
		const { lastFrame } = render(<HelpApp />);
		
		expect(lastFrame()).toContain('times [city]');
		expect(lastFrame()).toContain('guide');
		expect(lastFrame()).toContain('cities');
	});
});
