import { SelectOption } from "../types";

export const useSelectOptions = () => {
  const yearOptions: SelectOption[] = Array.from({ length: 100 }, (_, i) => ({
    value: (2000 + i).toString(),
    label: (2000 + i).toString(),
  }));

  const monthOptions: SelectOption[] = [
    { value: "1", label: "Январь" },
    { value: "2", label: "Февраль" },
    { value: "3", label: "Март" },
    { value: "4", label: "Апрель" },
    { value: "5", label: "Май" },
    { value: "6", label: "Июнь" },
    { value: "7", label: "Июль" },
    { value: "8", label: "Август" },
    { value: "9", label: "Сентябрь" },
    { value: "10", label: "Октябрь" },
    { value: "11", label: "Ноябрь" },
    { value: "12", label: "Декабрь" },
  ];

  return {
    yearOptions,
    monthOptions,
  };
};
