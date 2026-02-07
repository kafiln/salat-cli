import { LOCAL_STORAGE_PATH } from "#services/constants";
import { City, PrayerTimes } from "#services/types";
import { useApp } from "ink";
import { useEffect, useState } from "react";
// @ts-ignore
import { getData } from "#services/utils/api";
import { getCityId, getCityName } from "#services/utils/city";
import { parsePrayerTimesFromResponse } from "#services/utils/parser";
import { format } from "date-fns";
import { LocalStorage } from "node-localstorage";
import citiesData from "../data/cities.json" with { type: "json" };

const cities: City[] = citiesData as City[];
const localStorage = new LocalStorage(LOCAL_STORAGE_PATH);

interface UseSalatProps {
	cityNameArg?: string;
	once?: boolean;
}

export const useSalat = ({ cityNameArg, once }: UseSalatProps) => {
	const { exit } = useApp();
	const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [resolvedCityName, setResolvedCityName] = useState<string>("");
	const [currentTime, setCurrentTime] = useState<Date>(new Date());

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const name = getCityName(cityNameArg, cities);
				setResolvedCityName(name);

				const storageKey = `${name.toLowerCase()}_${format(new Date(), "yyyy-MM-dd")}`;
				let item = localStorage.getItem(storageKey);

				// Disable localStorage for local development
				if (process.env.NODE_ENV === "development") {
					item = null;
				}

				if (item) {
					setPrayerTimes(JSON.parse(item));
				} else {
					const cityId = getCityId(name, cities);
					const data = await getData(cityId);
					const prayers = parsePrayerTimesFromResponse(data);
					setPrayerTimes(prayers);
					localStorage.setItem(storageKey, JSON.stringify(prayers));
				}
			} catch (err: any) {
				setError(err.message || "An error occurred");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [cityNameArg]);

	useEffect(() => {
		if (once && !loading && (prayerTimes || error)) {
			// Small delay to ensure render happens
			// Ink might need a tick to flush the output to stdout
			const timer = setTimeout(() => {
				exit();
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [once, loading, prayerTimes, error, exit]);

	return {
		prayerTimes,
		error,
		loading,
		resolvedCityName,
		currentTime,
	};
};
