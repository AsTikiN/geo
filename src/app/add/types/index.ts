import { z } from "zod";

export const addPitSchema = z.object({
  year: z.string().min(1, "Укажите год"),
  month: z.string().min(1, "Укажите месяц"),
  city: z.string().min(1, "Укажите город"),
  street: z.string().min(1, "Укажите улицу"),
  files: z.any().optional(),
});

export type FormInputs = z.infer<typeof addPitSchema>;

export type SelectOption = {
  value: string;
  label: string;
};
