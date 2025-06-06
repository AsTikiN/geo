"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePitData } from "./hooks/usePitData";
import { FilesTable } from "./components/FilesTable";
import { FilePreview } from "./components/FilePreview";
import { Map } from "./components/Map";
import { File } from "./types";
import { BackHomeButton } from "@/app/shared/components/BackHomeButton";

export default function PreviewPitPage() {
  const params = useParams();

  const { data: pit, isLoading, error } = usePitData(params.id as string);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-[#86868B] text-lg">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-[#FF3B30] text-lg">
              {error instanceof Error ? error.message : "An error occurred"}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!pit) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-[#86868B] text-lg">No pit data found</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-8 py-16">
      <div className="max-w-7xl mx-auto">
        <BackHomeButton />

        <div className="text-center mb-16">
          <h1 className="text-5xl font-medium text-[#1D1D1F] mb-4">
            Информация о дорожных работах
          </h1>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Left column - Pit info */}
          <div className="col-span-6">
            <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] backdrop-blur-xl overflow-hidden p-12 h-full">
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-medium text-[#86868B] mb-2">
                      Год
                    </h3>
                    <p className="text-lg text-[#1D1D1F]">{pit.year}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#86868B] mb-2">
                      Месяц
                    </h3>
                    <p className="text-lg text-[#1D1D1F]">{pit.month}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[#86868B] mb-2">
                    Улица
                  </h3>
                  <p className="text-lg text-[#1D1D1F]">{pit.street}</p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-medium text-[#86868B] mb-2">
                      Дата создания
                    </h3>
                    <p className="text-lg text-[#1D1D1F]">
                      {new Date(pit.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[#86868B] mb-4">
                    Прикрепленные файлы
                  </h3>
                  <FilesTable
                    files={pit.files}
                    selectedFile={selectedFile}
                    onFileSelect={setSelectedFile}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right column - File preview */}
          <div className="col-span-6">
            <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] backdrop-blur-xl overflow-hidden p-12 h-full">
              {selectedFile ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-[#1D1D1F]">
                      {selectedFile.filename}
                    </h3>
                    <p className="text-sm text-[#86868B] mt-1">
                      {selectedFile.filetype} •{" "}
                      {new Date(selectedFile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="h-[calc(100%-80px)]">
                    <FilePreview file={selectedFile} />
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-[#86868B] text-center">
                    Выберите файл для просмотра
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom section - Full width map */}
          <div className="col-span-12 mt-8">
            <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] backdrop-blur-xl overflow-hidden p-12">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-[#1D1D1F]">
                  Расположение
                </h3>
                <p className="text-sm text-[#86868B] mt-1">{pit.street}</p>
              </div>
              <div className="h-[400px]">
                <Map address={pit.street} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
