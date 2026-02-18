import { City } from "#services/types";
import { getData } from "#services/utils/api";
import { getCityId, getCityName } from "#services/utils/city";
import { useQuery } from "@tanstack/react-query";
import citiesData from "../data/cities.json" with { type: "json" };

const cities: City[] = citiesData as City[];

interface UsePrayerTimesProps {
  cityNameArg?: string;
}

import { addDays } from "date-fns";

export const usePrayerTimes = ({ cityNameArg }: UsePrayerTimesProps) => {
  const resolvedCityName = getCityName(cityNameArg, cities);

  const query = useQuery({
    queryKey: ["prayerTimes", resolvedCityName],
    queryFn: async () => {
      const cityId = getCityId(resolvedCityName, cities);
      const now = new Date();
      const [today, tomorrow] = await Promise.all([
        getData(cityId, now),
        getData(cityId, addDays(now, 1)),
      ]);
      return { today, tomorrow };
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24, // garbage collection after 24 hours
  });

  return {
    prayerTimes: query.data?.today ?? null,
    tomorrowTimes: query.data?.tomorrow ?? null,
    error: query.error?.message ?? null,
    loading: query.isPending,
    resolvedCityName,
  };
};
