"use client";

import { useState } from "react";
import { ReportFilters } from "../../types/report";
import Select from "react-select";
import { customSelectStyles } from "../../add/components/selectStyles";

interface ReportGeneratorProps {
  onGenerate: (filters: ReportFilters) => Promise<void>;
}

interface SelectOption {
  value: string;
  label: string;
}

export function ReportGenerator({ onGenerate }: ReportGeneratorProps) {
  const [filters, setFilters] = useState<ReportFilters>({});
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onGenerate(filters);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Błąd podczas generowania raportu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_10px_20px_rgba(0,113,227,0.15)] p-8">
      <h2 className="text-2xl font-medium text-blue-900 mb-6">
        Generowanie raportu
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rok
            </label>
            <Select
              options={yearOptions}
              value={yearOptions.find(
                (option) => option.value === filters.year?.toString()
              )}
              onChange={(option) =>
                setFilters({
                  ...filters,
                  year: option ? parseInt(option.value) : undefined,
                })
              }
              isClearable
              placeholder="Wybierz rok"
              styles={customSelectStyles}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Miesiąc
            </label>
            <Select
              options={monthOptions}
              value={monthOptions.find(
                (option) => option.value === filters.month
              )}
              onChange={(option) =>
                setFilters({
                  ...filters,
                  month: option ? option.value : undefined,
                })
              }
              isClearable
              placeholder="Wybierz miesiąc"
              styles={customSelectStyles}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Miasto
            </label>
            <input
              type="text"
              value={filters.city || ""}
              onChange={(e) =>
                setFilters({ ...filters, city: e.target.value || undefined })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:border-transparent transition-colors placeholder:text-gray-400"
              placeholder="Wprowadź miasto"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ulica
            </label>
            <input
              type="text"
              value={filters.street || ""}
              onChange={(e) =>
                setFilters({ ...filters, street: e.target.value || undefined })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:border-transparent transition-colors placeholder:text-gray-400"
              placeholder="Wprowadź ulicę"
            />
          </div>
        </div>

        <div className="flex items-center">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={filters.noPdf || false}
              onChange={(e) =>
                setFilters({ ...filters, noPdf: e.target.checked })
              }
            />
            <span className="text-sm text-gray-700">Tylko wpisy bez PDF</span>
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 text-base font-medium text-white bg-[#0071E3] rounded-xl hover:bg-[#0077ED] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(0,113,227,0.3)]"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generowanie...
              </span>
            ) : (
              "Wygeneruj raport"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
