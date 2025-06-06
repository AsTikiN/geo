import { FormInputs } from "../types";

export const pitApi = {
  getPit: async (id: string) => {
    const response = await fetch(`/api/get-pit/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch pit");
    }
    return response.json();
  },

  editPit: async (id: string, formData: FormData) => {
    const response = await fetch(`/api/edit-pit/${id}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to edit pit");
    }

    return response.json();
  },
};
