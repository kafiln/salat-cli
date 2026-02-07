import { API_URL } from "#services/constants";

export const getData = async (cityId: number): Promise<string> => {
  const response = await fetch(`${API_URL}?ville=${cityId}`);
  return await response.text();
};
