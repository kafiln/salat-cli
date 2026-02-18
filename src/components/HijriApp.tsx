import { useHijriDate } from "#hooks/useHijriDate";
import { Box, Text } from "ink";
import React from "react";

const HijriApp: React.FC = () => {
  const { hijriDate, error, loading } = useHijriDate();

  if (loading) {
    return <Text>Loading hijri date...</Text>;
  }

  if (error) {
    return <Text color="red">Error: {error}</Text>;
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text color="blue">🕌 Hijri Date</Text>
      </Box>
      <Box padding={1}>
        <Text>{`${hijriDate}`}</Text>
      </Box>
    </Box>
  );
};

export default HijriApp;
