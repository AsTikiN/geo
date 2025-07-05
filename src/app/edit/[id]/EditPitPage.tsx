"use client";

import { useEditPitForm } from "./hooks/useEditPitForm";
import { useSelectOptions } from "./hooks/useSelectOptions";
import { EditPitForm } from "./components/EditPitForm";
import { FilesTable } from "@/app/shared/components/FilesTable";
import { useState, useEffect } from "react";
import Link from "next/link";

export interface File {
  id?: string;
  filename?: string;
  name?: string;
  filetype?: string;
  type?: string;
  size?: number;
  createdAt?: Date;
  filepath?: string;
}

interface EditPitPageProps {
  id: string;
}

export default function EditPitPage({ id }: EditPitPageProps) {
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    control,
    mutation,
    isLoading,
    pit,
  } = useEditPitForm(id);
  const { yearOptions, monthOptions } = useSelectOptions();
  const [files, setFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<File[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  useEffect(() => {
    if (pit) {
      setExistingFiles(pit.files);
      setFiles(pit.files);
      setValue("year", pit.year.toString());
      setValue("month", pit.month.toString());
      const [city, street] = pit.street.split("_") || [];
      setValue("city", city || "");
      setValue("street", street || "");
    }
  }, [pit, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const addedFiles = Array.from(e.target.files).map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
      }));
      setNewFiles(addedFiles);
      setFiles([...existingFiles, ...addedFiles]);
    }
  };

  const onSubmit = handleSubmit((data) => {
    console.log("Form submitted with data:", data);
    const formData = new FormData();
    formData.append("year", data.year);
    formData.append("month", data.month);
    formData.append("city", data.city);
    formData.append("street", data.street);

    // Only append new files
    if (data.files) {
      Array.from(data.files).forEach((file) => {
        formData.append("files", file as Blob);
      });
    }

    // Add existing file IDs to be kept
    existingFiles.forEach((file) => {
      if (file.id) {
        formData.append("existingFiles", file.id);
      }
    });

    console.log("Calling mutation with formData");
    mutation.mutate(formData);
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0071E3]"></div>
      </div>
    );
  }

  if (mutation.isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error: {mutation.error.message}</div>
      </div>
    );
  }

  if (!pit) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Pit not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link
          href="/documents"
          className="text-[#0071E3] hover:text-[#0077ED] transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Link>
        <h1 className="text-2xl font-medium text-blue-900 ml-4">
          Редактирование записи
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="bg-white rounded-2xl shadow-[0_10px_20px_rgba(0,113,227,0.15)] p-8">
          <EditPitForm
            register={register}
            control={control}
            errors={errors}
            setValue={setValue}
            yearOptions={yearOptions}
            monthOptions={monthOptions}
            onSubmit={onSubmit}
            isSubmitting={mutation.isPending}
            onFileChange={handleFileChange}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-[0_10px_20px_rgba(0,113,227,0.15)] p-8 min-h-[-webkit-fill-available]">
          <FilesTable files={files} existingFiles={existingFiles} />
        </div>
      </div>
    </div>
  );
}
