import { SelectOption } from "../types/index";

export const useSelectOptions = () => {
  const yearOptions: SelectOption[] = Array.from({ length: 100 }, (_, i) => ({
    value: (2000 + i).toString(),
    label: (2000 + i).toString(),
  }));

  const monthOptions: SelectOption[] = [
    { value: "1", label: "Styczeń" },
    { value: "2", label: "Luty" },
    { value: "3", label: "Marzec" },
    { value: "4", label: "Kwiecień" },
    { value: "5", label: "Maj" },
    { value: "6", label: "Czerwiec" },
    { value: "7", label: "Lipiec" },
    { value: "8", label: "Sierpień" },
    { value: "9", label: "Wrzesień" },
    { value: "10", label: "Październik" },
    { value: "11", label: "Listopad" },
    { value: "12", label: "Grudzień" },
  ];

  return {
    yearOptions,
    monthOptions,
  };
};
