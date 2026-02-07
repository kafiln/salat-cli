import { getHijriDate } from "#services/utils/hijri";
import { Box, Text } from "ink";
import React, { useEffect, useState } from "react";

const HijriApp: React.FC = () => {
  const [hijriDate, setHijriDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHijri = async () => {
      try {
        const result = await getHijriDate();
        setHijriDate(result.date);
      } catch (err: any) {
        setError(err.message || "Failed to fetch hijri date");
      } finally {
        setLoading(false);
      }
    };

    fetchHijri();
  }, []);

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
        <Text>{`\u061C${hijriDate}`}</Text>
      </Box>
    </Box>
  );
};

export default HijriApp;
