import { render } from 'ink-testing-library';
import { describe, expect, it } from 'vitest';
import CitiesApp from './CitiesApp.js';

describe('CitiesApp', () => {
	it('should render available cities', () => {
		const { lastFrame } = render(<CitiesApp />);
		
		expect(lastFrame()).toContain('Available Cities in Morocco');
		// Checking some expected cities (from data/cities.json)
		// I'll assume Casablanca and Rabat are there
		expect(lastFrame()).toContain('Casablanca');
		expect(lastFrame()).toContain('Rabat');
	});

	it('should display the tip', () => {
		const { lastFrame } = render(<CitiesApp />);
		expect(lastFrame()).toContain('Tip: Use these names with the \'times\' command');
	});
});
