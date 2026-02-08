import { API_URL } from "#services/constants";
import fetch from "node-fetch";
import https from "https";

const agent = new https.Agent({
  rejectUnauthorized: false,
});

export const getData = async (cityId: number): Promise<string> => {
  const response = await fetch(`${API_URL}?ville=${cityId}`, { agent });
  return await response.text();
};
