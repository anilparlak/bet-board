import type { IBetsResponse } from "../../types/betsApi.types";

const BASE_URL = "https://nesine-case-study.onrender.com";

export const fetchBets = async () => {
  try {
    const response = await fetch(`${BASE_URL}/bets` , {
      headers: { Accept: "application/json" },
    });
     if (!response.ok) {
      throw new Error(`Service is not avaible (HTTP ${response.status})`);
    }
    return (await response.json()) as IBetsResponse;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
