import Select from "react-select";
import { customSelectStyles } from "./selectStyles";
import { AddPitFormProps } from "../types";

export function AddPitForm({
  register,
  control,
  errors,
  setValue,
  yearOptions,
  monthOptions,
  onSubmit,
  isSubmitting,
  onFileChange,
}: AddPitFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
          Год
        </label>
        <Select
          options={yearOptions}
          styles={customSelectStyles}
          placeholder="Выберите год"
          onChange={(option) => setValue("year", option?.value || "")}
          className="react-select-container"
          classNamePrefix="react-select"
        />
        {errors.year && (
          <span className="text-[#FF3B30] text-sm">{errors.year.message}</span>
        )}
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
          Месяц
        </label>
        <Select
          options={monthOptions}
          styles={customSelectStyles}
          placeholder="Выберите месяц"
          onChange={(option) => setValue("month", option?.value || "")}
          className="react-select-container"
          classNamePrefix="react-select"
        />
        {errors.month && (
          <span className="text-[#FF3B30] text-sm">{errors.month.message}</span>
        )}
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
          Город
        </label>
        <input
          type="text"
          placeholder="Название города"
          className="w-full px-6 py-4 text-base text-[#1D1D1F] bg-[#F5F7FA] border-2 border-transparent rounded-2xl focus:outline-none focus:border-[#0071E3] transition-colors placeholder:text-[#1D1D1F]/60"
          {...register("city", { required: "Введите город" })}
        />
        {errors.city && (
          <span className="text-[#FF3B30] text-sm">{errors.city.message}</span>
        )}
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
          Улица
        </label>
        <input
          type="text"
          placeholder="Название улицы"
          className="w-full px-6 py-4 text-base text-[#1D1D1F] bg-[#F5F7FA] border-2 border-transparent rounded-2xl focus:outline-none focus:border-[#0071E3] transition-colors placeholder:text-[#1D1D1F]/60"
          {...register("street", { required: "Введите улицу" })}
        />
        {errors.street && (
          <span className="text-[#FF3B30] text-sm">
            {errors.street.message}
          </span>
        )}
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#1D1D1F] mb-2">
          Документы
        </label>
        <div className="relative">
          <input
            type="file"
            multiple
            className="w-full px-6 py-4 text-base text-[#1D1D1F] bg-[#F5F7FA] border-2 border-dashed border-[#86868B] rounded-2xl focus:outline-none focus:border-[#0071E3] transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-[#0071E3] file:text-white hover:file:bg-[#0077ED]"
            {...register("files")}
            onChange={onFileChange}
          />
        </div>
        {errors.files && (
          <span className="text-[#FF3B30] text-sm">
            {errors.files.message as string}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-8 px-8 py-4 text-base font-medium text-white bg-[#0071E3] rounded-2xl hover:bg-[#0077ED] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(0,113,227,0.15)]"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
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
            Загрузка...
          </span>
        ) : (
          "Создать запись"
        )}
      </button>
    </form>
  );
}
