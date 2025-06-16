import { File } from "../types";

interface FilesTableProps {
  files: File[];
  onRemoveFile: (fileId: string) => void;
  showRemoveButton?: boolean;
  onClearFiles?: () => void;
}

export function FilesTable({
  files,
  onRemoveFile,
  showRemoveButton = false,
  onClearFiles,
}: FilesTableProps) {
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
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
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

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Нет загруженных файлов
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Загруженные файлы</h3>
        {onClearFiles && (
          <button
            onClick={onClearFiles}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Очистить все
          </button>
        )}
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
              Файл
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
              Формат
            </th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr
              key={file.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-3 px-4">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <span className="text-sm text-gray-900">{file.name}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {formatFileType(file.type)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
