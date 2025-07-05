"use client";

import { File } from "@/app/types";

interface FilesTableProps {
  files: File[];
  existingFiles?: File[];
}

export function FilesTable({ files, existingFiles = [] }: FilesTableProps) {
  const isExistingFile = (file: File) =>
    existingFiles.some((f) => f.id === file.id);

  const formatFileType = (type: string) => {
    const fileType = type.toLowerCase();

    // Common file type mappings
    const typeMap: Record<string, string> = {
      "vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
      "vnd.ms-excel": "xls",
      "vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
      msword: "doc",
      "vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
      "vnd.ms-powerpoint": "ppt",
      pdf: "pdf",
      jpeg: "jpg",
      png: "png",
      gif: "gif",
      "svg+xml": "svg",
      plain: "txt",
      csv: "csv",
      zip: "zip",
      rar: "rar",
      "7z": "7z",
    };

    // Try to find a match in the typeMap
    for (const [key, value] of Object.entries(typeMap)) {
      if (fileType.includes(key)) {
        return value.toUpperCase();
      }
    }

    // If no match found, return the last part of the type or "Unknown"
    const lastPart = type.split("/").pop()?.split(".").pop();
    return lastPart ? lastPart.toUpperCase() : "Unknown";
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) {
      return (
        <svg
          className="w-6 h-6 text-[#FF3B30]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      );
    }
    if (type.includes("image")) {
      return (
        <svg
          className="w-6 h-6 text-[#34C759]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"
          />
        </svg>
      );
    }
    return (
      <svg
        className="w-6 h-6 text-[#007AFF]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    );
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Прикрепленные файлы
      </h3>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Название
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Тип
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {files.map((file) => {
              // Handle both existing files (filename/filetype) and new files (name/type)
              const fileName = file.filename || file.name || "Unknown file";
              const fileType = file.filetype || file.type || "Unknown";
              const isExisting = isExistingFile(file);

              return (
                <tr
                  key={file.id || file.name}
                  className={`${
                    isExisting ? "bg-gray-50" : "bg-white hover:bg-gray-50"
                  } transition-colors`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-lg bg-blue-50">
                        {getFileIcon(fileType)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {fileName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(
                            file.createdAt || Date.now()
                          ).toLocaleDateString("ru-RU")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {formatFileType(fileType)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
