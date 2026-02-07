import { useSalat } from '#hooks/useSalat';
import { render } from 'ink-testing-library';
import { describe, expect, it, vi } from 'vitest';
import TimesApp from './TimesApp.js';

vi.mock('#hooks/useSalat', () => ({
	useSalat: vi.fn()
}));

describe('TimesApp', () => {
	it('should render loading state', () => {
		(vi.mocked(useSalat)).mockReturnValue({
			prayerTimes: null,
			error: null,
			loading: true,
			resolvedCityName: '',
			currentTime: new Date()
		});

		const { lastFrame } = render(<TimesApp />);
		expect(lastFrame()).toContain('Loading prayer times...');
	});

	it('should render error state', () => {
		(vi.mocked(useSalat)).mockReturnValue({
			prayerTimes: null,
			error: 'Failed to fetch',
			loading: false,
			resolvedCityName: '',
			currentTime: new Date()
		});

		const { lastFrame } = render(<TimesApp />);
		expect(lastFrame()).toContain('Error: Failed to fetch');
	});

	it('should render null prayerTimes state', () => {
		(vi.mocked(useSalat)).mockReturnValue({
			prayerTimes: null,
			error: null,
			loading: false,
			resolvedCityName: '',
			currentTime: new Date()
		});

		const { lastFrame } = render(<TimesApp />);
		expect(lastFrame()).toContain('Could not fetch prayer times.');
	});

	it('should render prayer times', () => {
		const mockPrayerTimes = {
			Fajr: "05:00",
			Chorouq: "06:30",
			Dhuhr: "12:30",
			Asr: "15:45",
			Maghrib: "18:20",
			Ishae: "19:50"
		};

		(vi.mocked(useSalat)).mockReturnValue({
			prayerTimes: mockPrayerTimes,
			error: null,
			loading: false,
			resolvedCityName: 'Marrakech',
			currentTime: new Date('2026-02-07T10:00:00')
		});

		const { lastFrame } = render(<TimesApp />);
		
		expect(lastFrame()).toContain('Marrakech, Morocco');
		expect(lastFrame()).toContain('Fajr');
		expect(lastFrame()).toContain('05:00 AM');
		expect(lastFrame()).toContain('Next Prayer: Dhuhr');
	});
});
