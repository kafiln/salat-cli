const API_URL = "https://habous.gov.ma/prieres/horaire_hijri_2.php";

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
    LOCAL_STORAGE_PATH: "./storage",
};
