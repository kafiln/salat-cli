import { Box, Text } from "ink";
import React from "react";

interface ProgressBarProps {
    progress: number;
    width: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, width }) => {
    const filledWidth = Math.max(0, Math.min(width, Math.round(progress * width)));
    const emptyWidth = width - filledWidth;

    return (
        <Box>
            <Text color="green">{"█".repeat(filledWidth)}</Text>
            <Text color="gray">{"░".repeat(emptyWidth)}</Text>
        </Box>
    );
};
