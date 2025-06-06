import { z } from "zod";

export const editPitSchema = z.object({
  year: z.string().min(1, "Выберите год"),
  month: z.string().min(1, "Выберите месяц"),
  city: z.string().min(1, "Введите название города"),
  street: z.string().min(1, "Введите название улицы"),
  files: z.any().optional(),
});

export type FormInputs = z.infer<typeof editPitSchema>;

export interface SelectOption {
  value: string;
  label: string;
}
