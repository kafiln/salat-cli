import { LOCAL_STORAGE_PATH } from "#constants";
import { City, PrayerTimes } from "#types";
import {
    getCityId,
    getCityName,
    getData,
    getNextPrayer,
    parsePrayerTimesFromResponse,
    tConv24,
} from "#utils";
import { Box, Text, useApp } from "ink";
import React, { useEffect, useState } from "react";
// @ts-ignore
import { format } from "date-fns";
import { LocalStorage } from "node-localstorage";
import citiesData from "./data/cities.json" with { type: "json" };

const cities: City[] = citiesData as City[];
const localStorage = new LocalStorage(LOCAL_STORAGE_PATH);

interface AppProps {
	cityNameArg?: string;
}

const App: React.FC<AppProps> = ({ cityNameArg }) => {
	const { exit } = useApp();
	const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [resolvedCityName, setResolvedCityName] = useState<string>("");

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
		if (!loading && (prayerTimes || error)) {
			// Small delay to ensure render happens
			// Ink might need a tick to flush the output to stdout
			const timer = setTimeout(() => {
				exit();
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [loading, prayerTimes, error, exit]);

	if (loading) {
		return <Text>Loading prayer times...</Text>;
	}

	if (error) {
		return <Text color="red">Error: {error}</Text>;
	}

	if (!prayerTimes) {
		return <Text color="red">Could not fetch prayer times.</Text>;
	}

	return (
		<Box flexDirection="column" padding={1}>
			<Box marginBottom={1}>
				<Text>🧭 {resolvedCityName}, Morocco</Text>
			</Box>
			<Box marginBottom={1}>
				<Text>📅 {format(new Date(), "PPPP")}</Text>
			</Box>
			{prayerTimes && (
				<Box borderStyle="round" borderColor="cyan" paddingX={1} marginBottom={1} flexDirection="column">
					<Box>
						<Text bold color="cyan">Next Prayer: </Text>
						<Text bold>{getNextPrayer(prayerTimes, new Date()).prayer}</Text>
					</Box>
					<Box>
						<Text>Time: </Text>
						<Text>{tConv24(getNextPrayer(prayerTimes, new Date()).time)}</Text>
					</Box>
					<Box>
						<Text color="yellow">Remaining: </Text>
						<Text color="yellow">{getNextPrayer(prayerTimes, new Date()).timeLeft}</Text>
					</Box>
				</Box>
			)}
			<Box flexDirection="column">
				{Object.entries(prayerTimes).map(([prayer, time]) => {
					const isNext = prayer === getNextPrayer(prayerTimes!, new Date()).prayer;
					return (
						<Box key={prayer}>
							<Box width={10}>
								<Text color={isNext ? "cyan" : "white"} bold={isNext}>{prayer}</Text>
							</Box>
							<Box marginRight={2}>
								<Text color={isNext ? "cyan" : "gray"}>--&gt;</Text>
							</Box>
							<Text color={isNext ? "yellow" : "green"} bold={isNext}>{tConv24(time)}</Text>
						</Box>
					);
				})}
			</Box>
		</Box>
	);
};

export default App;
