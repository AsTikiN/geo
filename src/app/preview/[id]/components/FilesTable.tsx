import { File } from "../types";

interface FilesTableProps {
  files: File[];
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
}

export function FilesTable({ files, selectedFile, onFileSelect }: FilesTableProps) {
  const getFileIcon = (filetype: string) => {
    switch (filetype.toLowerCase()) {
      case "pdf":
        return (
          <svg
            className="w-5 h-5 text-[#FF3B30]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM9 13h6v2H9v-2zm0-4h6v2H9V9z" />
          </svg>
        );
      case "jpg":
      case "jpeg":
      case "png":
        return (
          <svg
            className="w-5 h-5 text-[#34C759]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
          </svg>
        );
      default:
        return (
          <svg
            className="w-5 h-5 text-[#007AFF]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
          </svg>
        );
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Plik
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Typ
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {files.map((file) => (
              <tr
                key={file.id}
                onClick={() => onFileSelect(file)}
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedFile?.id === file.id ? "bg-blue-50" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.filetype)}
                    <span className="text-sm text-gray-900">
                      {file.filename}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-500 uppercase">
                    {file.filetype}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
