"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import debounce from "lodash/debounce";
import { ClientSelect } from "./ClientSelect";
import { useQueryClient } from "@tanstack/react-query";

const monthOptions = [
  { value: "", label: "Wszystkie miesiące" },
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

const sortOptions = [
  { value: "", label: "Sortowanie" },
  { value: "date_desc", label: "Najpierw nowe" },
  { value: "date_asc", label: "Najpierw stare" },
  { value: "street_asc", label: "Po ulicy (A-Ż)" },
  { value: "street_desc", label: "Po ulicy (Ż-A)" },
];

const yearOptions = [
  { value: "", label: "Wszystkie lata" },
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
    router.replace(`/documents?${params.toString()}`, { scroll: false });
  };

  const handleCheckboxChange = (checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (checked) {
      params.set("noPdf", "true");
    } else {
      params.delete("noPdf");
    }
    router.replace(`/documents?${params.toString()}`, { scroll: false });
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      router.replace(`/documents?${params.toString()}`, { scroll: false });
    }, 300),
    [searchParams, router]
  );

  const customStyles = {
    control: (base: Record<string, unknown>) => ({
      ...base,
      minHeight: "42px",
      borderRadius: "0.5rem",
      borderColor: "#E5E7EB",
      "&:hover": {
        borderColor: "#E5E7EB",
      },
    }),
    option: (
      base: Record<string, unknown>,
      state: { isSelected: boolean }
    ) => ({
      ...base,
      backgroundColor: state.isSelected ? "#0071E3" : "white",
      color: state.isSelected ? "white" : "#1F2937",
      "&:hover": {
        backgroundColor: state.isSelected ? "#0071E3" : "#F3F4F6",
      },
    }),
    placeholder: (base: Record<string, unknown>) => ({
      ...base,
      color: "#6B7280",
    }),
  };

  return (
    <div className="mb-8">
      <div className="flex gap-4 items-center flex-wrap">
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
            placeholder="Rok"
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
            placeholder="Miesiąc"
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
            placeholder="Sortowanie"
            isClearable
          />
        </div>

        <div className="w-96 relative">
          <input
            type="text"
            placeholder="Szukaj po roku, miesiącu, ulicy..."
            className="w-full h-[42px] pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 text-base"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              debouncedSearch(e.target.value);
            }}
          />
          <svg
            className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex items-center">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={searchParams.get("noPdf") === "true"}
              onChange={(e) => handleCheckboxChange(e.target.checked)}
            />
            <span className="text-sm text-gray-700">Bez PDF</span>
          </label>
        </div>
      </div>
    </div>
  );
}
