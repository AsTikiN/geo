"use client";

import { useAddPitForm } from "./hooks/useAddPitForm";
import { useSelectOptions } from "./hooks/useSelectOptions";
import { AddPitForm } from "./components/AddPitForm";
import { FilesTable } from "./components/FilesTable";
import { useState } from "react";
import { File } from "./types";
import Link from "next/link";

export default function AddPitPage() {
  const { register, handleSubmit, errors, setValue, control, mutation } =
    useAddPitForm();
  const { yearOptions, monthOptions } = useSelectOptions();
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        file: file,
      }));
      setFiles(newFiles);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log("Add pit form submitted with data:", data);
      const formData = new FormData();
      formData.append("year", data.year);
      formData.append("month", data.month);
      formData.append("city", data.city);
      formData.append("street", data.street);

      // Add files to formData
      files.forEach((file) => {
        formData.append("files", file.file);
      });

      console.log("Calling add pit mutation with formData");
      await mutation.mutateAsync(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/documents"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
          <div>
            <h1 className="text-4xl font-medium text-blue-900 mb-2">
              Nowy wpis
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-2xl shadow-[0_10px_20px_rgba(0,113,227,0.15)] p-8">
            <AddPitForm
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

            {mutation.isError && (
              <div className="mt-6 p-4 bg-[#FF3B30]/10 rounded-xl">
                <p className="text-[#FF3B30] text-sm text-center">
                  {mutation.error.message}
                </p>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6">
            <FilesTable
              files={files}
              onRemoveFile={handleRemoveFile}
              showRemoveButton={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
