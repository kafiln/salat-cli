import { useHijriDate } from "#hooks/useHijriDate";
import { usePrayerTimes } from "#hooks/usePrayerTimes";
import { PrayerName } from "#services/types";
import { getImsakTime, getNextPrayer, tConv24 } from "#services/utils/time";
import { differenceInSeconds, format, parse, subDays } from "date-fns";
import { Box, Text, useApp, useInput } from "ink";
import React, { useEffect, useState } from "react";

interface AppProps {
  cityNameArg?: string;
  once?: boolean;
  onReset?: () => void;
}

const ProgressBar: React.FC<{ progress: number; width: number }> = ({
  progress,
  width,
}) => {
  const filledWidth = Math.max(0, Math.min(width, Math.round(progress * width)));
  const emptyWidth = width - filledWidth;

  return (
    <Box>
      <Text color="green">{"█".repeat(filledWidth)}</Text>
      <Text color="gray">{"░".repeat(emptyWidth)}</Text>
    </Box>
  );
};

const App: React.FC<AppProps> = ({ cityNameArg, once, onReset }) => {
  const { exit } = useApp();
  const { prayerTimes, error, loading, resolvedCityName } = usePrayerTimes({
    cityNameArg,
  });
  const { hijriDate } = useHijriDate();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useInput((input) => {
    const key = input.toLowerCase();
    if (key === "c" && onReset) {
      onReset();
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (once && !loading && (prayerTimes || error)) {
      const timer = setTimeout(() => {
        exit();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [once, loading, prayerTimes, error, exit]);

  if (loading) {
    return (
      <Box padding={1}>
        <Text color="yellow">Loading prayer times for {resolvedCityName}...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box padding={1}>
        <Text color="red" bold>Error: {error}</Text>
      </Box>
    );
  }

  if (!prayerTimes) {
    return (
      <Box padding={1}>
        <Text color="red" bold>Could not fetch prayer times.</Text>
      </Box>
    );
  }

  const nextPrayerData = getNextPrayer(prayerTimes, currentTime);

  // Calculate progress
  const prayerOrder: PrayerName[] = ["Fajr", "Chorouq", "Dhuhr", "Asr", "Maghrib", "Ishae"];
  const nextIndex = prayerOrder.indexOf(nextPrayerData.prayer as PrayerName);
  const prevIndex = (nextIndex - 1 + prayerOrder.length) % prayerOrder.length;
  const prevPrayerName = prayerOrder[prevIndex];

  let prevDate = parse(prayerTimes[prevPrayerName], "HH:mm", currentTime);
  let nextDate = parse(nextPrayerData.time, "HH:mm", currentTime);

  if (nextPrayerData.prayer === "Fajr" && currentTime.getHours() >= 12) {
    nextDate = parse(nextPrayerData.time, "HH:mm", new Date(currentTime.getTime() + 24 * 60 * 60 * 1000));
  } else if (nextPrayerData.prayer === "Fajr" && currentTime.getHours() < 12) {
    prevDate = subDays(parse(prayerTimes.Ishae, "HH:mm", currentTime), 1);
  }

  const totalSeconds = differenceInSeconds(nextDate, prevDate);
  const elapsedSeconds = differenceInSeconds(currentTime, prevDate);
  const progress = Math.max(0, Math.min(1, elapsedSeconds / totalSeconds));

  return (
    <Box
      flexDirection="column"
      paddingX={2}
      paddingY={1}
      borderStyle="round"
      borderColor="green"
      width={60}
    >
      {/* Header */}
      <Box flexDirection="column" alignItems="center" gap={1}>
        <Box borderStyle="single" borderColor="green">
          <Text bold color="green">
            🇲🇦 {resolvedCityName}, Morocco 🇲🇦
          </Text>
        </Box>
        <Box marginTop={1}>
          <Text color="white" bold>
            📅  {format(currentTime, "EEEE, MMMM do yyyy")}
          </Text>
        </Box>
        {hijriDate && (
          <Text color="gray" dimColor>
            🕌 {hijriDate}
          </Text>
        )}
      </Box>

      {/* Progress Section */}


      {/* Prayer Times List */}
      <Box flexDirection="column" marginY={1}>
        {Object.entries({
          "Imsak *": getImsakTime(prayerTimes.Fajr),
          ...prayerTimes,
        }).map(([prayer, time]) => {
          const isNext = prayer === nextPrayerData.prayer;
          const isImsak = prayer === "Imsak *";

          return (
            <Box
              key={prayer}
              justifyContent="space-between"
              paddingX={2}
              backgroundColor={isNext ? "green" : undefined}
            >
              <Box>
                <Text color={isNext ? "white" : (isImsak ? "gray" : "white")} bold={isNext}>
                  {isNext ? "> " : "  "}
                  {prayer.padEnd(12)}
                </Text>
              </Box>

              <Box>
                <Text color={isNext ? "white" : (isImsak ? "gray" : "white")} bold={isNext}>
                  {tConv24(time)}
                </Text>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Disclaimer */}
      <Box paddingX={2} marginTop={1}>
        <Text dimColor color="gray" italic>
          * Imsak is 10 min before Fajr for safety
        </Text>
      </Box>

      {/* Footer / Status */}
      <Box
        marginTop={1}
        paddingX={2}
        paddingY={1}
        flexDirection="column"
        alignItems="center"
        borderStyle="single"
        borderColor="yellow"
      >
        <Text>
          Next: <Text color="green" bold>{nextPrayerData.prayer}</Text> in <Text color="yellow" bold>{nextPrayerData.timeLeft}</Text>
        </Text>
        <Box flexDirection="column" alignItems="center" marginY={1}>
          <ProgressBar progress={progress} width={50} />
          <Box justifyContent="space-between" width={50} marginTop={0}>
            <Text color="gray" dimColor>0%</Text>
            <Text color="green" bold>{Math.round(progress * 100)}%</Text>
            <Text color="gray" dimColor>100%</Text>
          </Box>
        </Box>
      </Box>

      {!once && (
        <Box marginTop={1} justifyContent="center">
          <Text dimColor color="gray">
            [C] Change City  •  [Ctrl+C] Exit
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default App;
