import { Pit } from "../types";

export const pitApi = {
  getPit: async (id: string): Promise<Pit> => {
    const response = await fetch(`/api/get-pit/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch pit");
    }
    return response.json();
  },
}; 