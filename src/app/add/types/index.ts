import { z } from "zod";

export const addPitSchema = z.object({
  year: z.string().min(1, "Podaj rok"),
  month: z.string().min(1, "Podaj miesiąc"),
  city: z.string().min(1, "Podaj miasto"),
  street: z.string().min(1, "Podaj ulicę"),
  author: z.string().min(1, "Podaj autora"),
  files: z.any().optional(),
});

export type FormInputs = z.infer<typeof addPitSchema>;

export type SelectOption = {
  value: string;
  label: string;
};
