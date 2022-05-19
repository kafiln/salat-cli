const API_URL =
  "http://www.habous.gov.ma/prieres/horaire-api.php";

const BANNER = ``;

const NOT_FOUND_ERROR = `
  Your city was not found in the list
  Using the default city
  ----------------------
  You may need to check the spelling
  `;

module.exports = {
  API_URL,
  BANNER,
  NOT_FOUND_ERROR,
  DEFAULT_CITY: "Marrakech",
  LOCAL_STORAGE_PATH: "./storage"
};
