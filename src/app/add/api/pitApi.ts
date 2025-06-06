import { FormInputs } from "../types";

export const pitApi = {
  addPit: async (formData: FormData) => {
    const response = await fetch(`/api/add-pit`, {
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
