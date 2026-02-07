import { useSalat } from "#hooks/useSalat";
import { getNextPrayer, tConv24 } from "#services/utils/time";
import { format } from "date-fns";
import { Box, Text } from "ink";
import React from "react";

interface AppProps {
	cityNameArg?: string;
	once?: boolean;
}

const App: React.FC<AppProps> = ({ cityNameArg, once }) => {
	const { prayerTimes, error, loading, resolvedCityName, currentTime } = useSalat({
		cityNameArg,
		once,
	});

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
				<Text>📅 {format(currentTime, "PPPP")}</Text>
			</Box>
			{prayerTimes && (
				<Box borderStyle="round" borderColor="cyan" paddingX={1} marginBottom={1} flexDirection="column">
					<Box>
						<Text bold color="cyan">Next Prayer: </Text>
						<Text bold>{getNextPrayer(prayerTimes, currentTime).prayer}</Text>
					</Box>
					<Box>
						<Text>Time: </Text>
						<Text>{tConv24(getNextPrayer(prayerTimes, currentTime).time)}</Text>
					</Box>
					<Box>
						<Text color="yellow">Remaining: </Text>
						<Text color="yellow">{getNextPrayer(prayerTimes, currentTime).timeLeft}</Text>
					</Box>
				</Box>
			)}
			<Box flexDirection="column">
				{Object.entries(prayerTimes).map(([prayer, time]) => {
					const isNext = prayer === getNextPrayer(prayerTimes!, currentTime).prayer;
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
