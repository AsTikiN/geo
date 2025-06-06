"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import debounce from "lodash/debounce";
import { ClientSelect } from "./ClientSelect";
import { useQueryClient } from "@tanstack/react-query";

const monthOptions = [
  { value: "", label: "Все месяцы" },
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

const sortOptions = [
  { value: "", label: "Сортировка" },
  { value: "date_desc", label: "Сначала новые" },
  { value: "date_asc", label: "Сначала старые" },
  { value: "street_asc", label: "По улице (А-Я)" },
  { value: "street_desc", label: "По улице (Я-А)" },
];

const yearOptions = [
  { value: "", label: "Все годы" },
  ...Array.from({ length: 100 }, (_, i) => {
    const year = 2000 + i;
    return { value: year.toString(), label: year.toString() };
  }),
];

export function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setSearchValue(searchParams.get("search") || "");
  }, [searchParams]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/?${params.toString()}`);
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      router.push(`/?${params.toString()}`);
    }, 300),
    [searchParams, router]
  );

  const customStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: "42px",
      borderRadius: "0.5rem",
      borderColor: "#E5E7EB",
      "&:hover": {
        borderColor: "#E5E7EB",
      },
    }),
    option: (base: any, state: { isSelected: boolean }) => ({
      ...base,
      backgroundColor: state.isSelected ? "#0071E3" : "white",
      color: state.isSelected ? "white" : "#1F2937",
      "&:hover": {
        backgroundColor: state.isSelected ? "#0071E3" : "#F3F4F6",
      },
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#6B7280",
    }),
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="flex gap-4">
        <div className="w-48">
          <ClientSelect
            options={yearOptions}
            value={
              yearOptions.find(
                (option) => option.value === searchParams.get("year")
              ) || null
            }
            onChange={(option) =>
              handleFilterChange("year", option?.value || "")
            }
            styles={customStyles}
            placeholder="Год"
            isClearable
          />
        </div>

        <div className="w-48">
          <ClientSelect
            options={monthOptions}
            value={
              monthOptions.find(
                (option) => option.value === searchParams.get("month")
              ) || null
            }
            onChange={(option) =>
              handleFilterChange("month", option?.value || "")
            }
            styles={customStyles}
            placeholder="Месяц"
            isClearable
          />
        </div>

        <div className="w-48">
          <ClientSelect
            options={sortOptions}
            value={
              sortOptions.find(
                (option) => option.value === searchParams.get("sort")
              ) || null
            }
            onChange={(option) =>
              handleFilterChange("sort", option?.value || "")
            }
            styles={customStyles}
            placeholder="Сортировка"
            isClearable
          />
        </div>
      </div>

      <div className="w-full relative">
        <input
          type="text"
          placeholder="Поиск по году, месяцу, улице..."
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 text-base"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            debouncedSearch(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
