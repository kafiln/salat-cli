import { DEFAULT_CITY, NOT_FOUND_ERROR } from "#services/constants";
import { City } from "#services/types";

export const getCityName = (
  arg: string | undefined,
  cities: City[],
): string => {
  if (arg == null) return DEFAULT_CITY;
  const index = getCityIndex(arg, cities);
  if (index === -1) {
    console.error(NOT_FOUND_ERROR);
    return DEFAULT_CITY;
  }
  return arg;
};

export const getCityId = (arg: string, cities: City[]): number => {
  const parsed = parseInt(arg);
  if (parsed && cities.length >= parsed) {
    return parsed;
  }
  return getCityIndex(arg, cities) + 1;
};

export const getCityIndex = (city: string, cities: City[]): number =>
  cities.map((e) => e.frenchName.toLowerCase()).indexOf(city.toLowerCase());
