import { z } from "zod";

export const editPitSchema = z.object({
  year: z.string().min(1, "Wybierz rok"),
  month: z.string().min(1, "Wybierz miesiąc"),
  city: z.string().min(1, "Wprowadź nazwę miasta"),
  street: z.string().min(1, "Wprowadź nazwę ulicy"),
  author: z.string().min(1, "Wprowadź nazwę autora"),
  files: z.any().optional(),
});

export type FormInputs = z.infer<typeof editPitSchema>;

export interface SelectOption {
  value: string;
  label: string;
}
