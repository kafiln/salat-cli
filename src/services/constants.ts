export const API_URL = "https://apisearch.hadithm6.ma/api";
export const HIJRI_API_URL = API_URL + "/hijridate";

export const PRIERE_API_URL = (cityId: number, day: number, month: number) =>
  API_URL + `/prieres/ville/${cityId}/${month}/${day}`;

export const NOT_FOUND_ERROR = `
  Your city was not found in the list
  Using the default city
  ----------------------
  You may need to check the spelling
  `;

export const DEFAULT_CITY = "Marrakech";
