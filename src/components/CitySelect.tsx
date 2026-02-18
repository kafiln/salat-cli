import { City } from "#services/types";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import TextInput from "ink-text-input";
import React, { useMemo, useState } from "react";
import citiesData from "../data/cities.json" with { type: "json" };

const cities = citiesData as City[];

interface CitySelectProps {
    onSelect: (city: string) => void;
}

const CitySelect: React.FC<CitySelectProps> = ({ onSelect }) => {
    const [query, setQuery] = useState("");

    const filteredCities = useMemo(() => {
        if (!query) return cities;
        const lowerQuery = query.toLowerCase();
        return cities.filter(
            (c) =>
                c.frenchName.toLowerCase().includes(lowerQuery),
        );
    }, [query]);

    const items = filteredCities.map((c) => ({
        label: `${c.frenchName}`,
        value: c.frenchName,
    }));

    return (
        <Box flexDirection="column" paddingX={2} paddingY={1} width={60} borderStyle="round" borderColor="green">
            <Box flexDirection="column" alignItems="center" marginBottom={1}>
                <Box borderStyle="single" borderColor="green" paddingX={2}>
                    <Text bold color="green">SELECT YOUR CITY</Text>
                </Box>
            </Box>

            <Box marginBottom={1} paddingX={2}>
                <Text color="white" bold>Filter: </Text>
                <TextInput
                    value={query}
                    onChange={setQuery}
                    placeholder="Type city name..."
                />
            </Box>

            <Box borderStyle="single" borderColor="gray" padding={1}>
                {items.length > 0 ? (
                    <SelectInput
                        items={items.sort((a, b) => a.label.localeCompare(b.label))}
                        onSelect={(item) => onSelect(item.value)}
                        limit={8}
                        indicatorComponent={({ isSelected }) => (
                            <Text color="yellow">{isSelected ? "> " : "  "}</Text>
                        )}
                        itemComponent={({ label, isSelected }) => (
                            <Text color={isSelected ? "yellow" : "white"}>{label}</Text>
                        )}
                    />
                ) : (
                    <Box justifyContent="center" width="100%">
                        <Text color="red">No cities found.</Text>
                    </Box>
                )}
            </Box>

            <Box marginTop={1} justifyContent="center">
                <Text dimColor color="gray">
                    Use arrow keys to select • Enter to confirm
                </Text>
            </Box>
        </Box>
    );
};

export default CitySelect;
