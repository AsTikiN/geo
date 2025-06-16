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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to edit pit");
    }

    return data;
  },
};
