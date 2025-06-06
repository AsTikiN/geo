"use client";

import { useEditPitForm } from "./hooks/useEditPitForm";
import { useSelectOptions } from "./hooks/useSelectOptions";
import { EditPitForm } from "./components/EditPitForm";
import { use, useEffect } from "react";
import { FormInputs } from "./types";
import { BackHomeButton } from "@/app/shared/components/BackHomeButton";

export default function EditPitPage({ params }: { params: { id: string } }) {
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    control,
    mutation,
    isLoading,
    pit,
  } = useEditPitForm((use(params as any) as any).id);
  const { yearOptions, monthOptions } = useSelectOptions();

  useEffect(() => {
    if (pit) {
      setValue("year", pit.year.toString());
      setValue("month", pit.month.toString());
      const [city, street] = pit.street.split("_") || [];
      setValue("city", city || "");
      setValue("street", street || "");
    }
  }, [pit, setValue]);

  const onSubmit = handleSubmit((data: FormInputs) => {
    const formData = new FormData();
    formData.append("year", data.year);
    formData.append("month", data.month);
    formData.append("city", data.city);
    formData.append("street", data.street);

    if (data.files) {
      Array.from(data.files).forEach((file) => {
        formData.append("files", file as Blob);
      });
    }

    mutation.mutate(formData);
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-[#0071E3] border-t-transparent rounded-full"></div>
            <p className="mt-4 text-[#86868B]">Загрузка...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-8 py-16">
      <div className="max-w-3xl mx-auto">
        <BackHomeButton />

        <div className="text-center mb-16">
          <h1 className="text-5xl font-medium text-[#1D1D1F] mb-4">
            Редактировать запись
          </h1>
          <p className="text-[#86868B] text-lg">
            Измените информацию о дорожных работах
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] backdrop-blur-xl overflow-hidden p-12">
          <EditPitForm
            register={register}
            control={control}
            errors={errors}
            setValue={setValue}
            yearOptions={yearOptions}
            monthOptions={monthOptions}
            onSubmit={onSubmit}
            isSubmitting={mutation.isPending}
          />

          {mutation.isError && (
            <div className="mt-6 p-4 bg-[#FF3B30]/10 rounded-xl">
              <p className="text-[#FF3B30] text-sm text-center">
                {mutation.error.message}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
