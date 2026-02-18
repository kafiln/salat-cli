import { ProgressBar } from "#components/ProgressBar";
import { RamadanData } from "#services/utils/time";
import { Box, Text } from "ink";
import React from "react";

interface RamadanInfoProps {
    data: RamadanData;
}

export const RamadanInfo: React.FC<RamadanInfoProps> = ({ data }) => {
    if (!data) return null;

    if (data.type === "fasting") {
        return (
            <Box flexDirection="column" alignItems="center">
                <Text bold color="yellow">⌛ Iftar Progress</Text>
                <Box marginTop={1}>
                    <ProgressBar progress={data.progress} width={50} />
                </Box>
                <Box justifyContent="space-between" width={50}>
                    <Text color="gray" dimColor>Fajr</Text>
                    <Box>
                        <Text color="yellow" bold>{Math.round(data.progress * 100)}%</Text>
                        <Text color="gray"> to Maghrib</Text>
                    </Box>
                    <Text color="gray" dimColor>Iftar</Text>
                </Box>
            </Box>
        );
    }

    return (
        <Box flexDirection="column" alignItems="center">
            <Text bold color="yellow">🌙 Time to Imsak (Suhoor ends)</Text>
            <Box marginTop={1}>
                <Text color="yellow" bold>{data.timeLeft}</Text>
            </Box>
            <Text dimColor color="gray">until fast begins</Text>
        </Box>
    );
};
