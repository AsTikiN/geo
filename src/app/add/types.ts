import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { z } from "zod";

export const addPitSchema = z.object({
  year: z.string().min(1, "Выберите год"),
  month: z.string().min(1, "Выберите месяц"),
  city: z.string().min(1, "Введите город"),
  street: z.string().min(1, "Введите улицу"),
  author: z.string().min(1, "Введите автора"),
  files: z.any().optional(),
});

export type FormInputs = z.infer<typeof addPitSchema>;

export interface SelectOption {
  value: string;
  label: string;
}

export interface File {
  id: string;
  name: string;
  type: string;
  size: number;
  file: globalThis.File;
}

export interface AddPitFormProps {
  register: UseFormRegister<FormInputs>;
  control: Control<FormInputs>;
  errors: FieldErrors<FormInputs>;
  setValue: UseFormSetValue<FormInputs>;
  yearOptions: SelectOption[];
  monthOptions: SelectOption[];
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
