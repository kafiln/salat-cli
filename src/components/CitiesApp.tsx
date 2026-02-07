import { City } from "#services/types";
import { Box, Text } from "ink";
import React from "react";
import citiesData from "../data/cities.json" with { type: "json" };

const CitiesApp: React.FC = () => {
	const cities: City[] = citiesData as City[];
    // Sort cities alphabetically
    const sortedCities = [...cities].sort((a, b) => a.name.localeCompare(b.name));

	return (
		<Box flexDirection="column" padding={1}>
			<Box marginBottom={1}>
				<Text bold color="cyan">🌍 Available Cities in Morocco ({cities.length})</Text>
			</Box>
			
            <Box flexDirection="row" flexWrap="wrap">
                {sortedCities.map((city) => (
                    <Box key={city.id} width={25} marginBottom={0}>
                        <Text color="gray">- </Text>
                        <Text>{city.name}</Text>
                    </Box>
                ))}
            </Box>

			<Box marginTop={1}>
				<Text color="gray">Tip: Use these names with the 'times' command, e.g., 'salat times {sortedCities[0]?.name}'</Text>
			</Box>
		</Box>
	);
};

export default CitiesApp;
