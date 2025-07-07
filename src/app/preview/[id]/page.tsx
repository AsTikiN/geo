"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { usePitData } from "./hooks/usePitData";
import { FilesTable } from "./components/FilesTable";
import { FilePreview } from "./components/FilePreview";
import { Map } from "../../shared/modules/Map";
import { File } from "./types";
import Link from "next/link";

export default function PreviewPitPage() {
  const params = useParams();
  const { data: pit, isLoading, error } = usePitData(params.id as string);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0071E3]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-600">
            {error instanceof Error ? error.message : "Wystąpił błąd"}
          </div>
        </div>
      </div>
    );
  }

  if (!pit) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-600">Nie znaleziono danych</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
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
            Informacje o robotach drogowych
          </h1>
        </div>

        <Link
          href={`/edit/${params.id}`}
          className="inline-flex items-center px-4 py-2 bg-[#0071E3] text-white rounded-lg hover:bg-[#0077ED] transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edytuj
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Pit info */}
        <div className="bg-white rounded-2xl shadow-[0_10px_20px_rgba(0,113,227,0.15)] p-8">
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-medium text-[#86868B] mb-2">Rok</h3>
                <p className="text-lg text-[#1D1D1F]">{pit.year}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#86868B] mb-2">
                  Miesiąc
                </h3>
                <p className="text-lg text-[#1D1D1F]">{pit.month}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-[#86868B] mb-2">Ulica</h3>
              <p className="text-lg text-[#1D1D1F]">{pit.street}</p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-medium text-[#86868B] mb-2">
                  Data ostatniej modyfikacji
                </h3>
                <p className="text-lg text-[#1D1D1F]">
                  {pit.lastFileModification
                    ? new Date(pit.lastFileModification).toLocaleDateString()
                    : new Date(pit.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-[#86868B] mb-4">
                Załączone pliki
              </h3>
              <FilesTable
                files={pit.files}
                selectedFile={selectedFile}
                onFileSelect={setSelectedFile}
              />
            </div>
          </div>
        </div>

        {/* Right column - File preview */}
        <div className="bg-white rounded-2xl shadow-[0_10px_20px_rgba(0,113,227,0.15)] p-8">
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
                Wybierz plik do podglądu
              </p>
            </div>
          )}
        </div>

        {/* Bottom section - Full width map */}
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-[0_10px_20px_rgba(0,113,227,0.15)] p-8">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-[#1D1D1F]">
                Lokalizacja
              </h3>
              <p className="text-sm text-[#86868B] mt-1">{pit.street}</p>
            </div>
            <div className="h-[400px]">
              <Map pits={[pit]} showPopup={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
