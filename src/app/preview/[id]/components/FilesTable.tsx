import { File } from "../types";

interface FilesTableProps {
  files: File[];
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
}

export const FilesTable = ({
  files,
  selectedFile,
  onFileSelect,
}: FilesTableProps) => {
  if (!files.length) {
    return (
      <p className="text-[#86868B] text-center py-4">
        Нет прикрепленных файлов
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#E5E5E5]">
            <th className="text-left py-3 px-4 text-sm font-medium text-[#86868B]">
              Название
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-[#86868B]">
              Тип файла
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-[#86868B]">
              Дата загрузки
            </th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr
              key={file.id}
              className={`border-b border-[#E5E5E5] last:border-0 cursor-pointer hover:bg-[#F5F7FA] transition-colors ${
                selectedFile?.id === file.id ? "bg-[#F5F7FA]" : ""
              }`}
              onClick={() => onFileSelect(file)}
            >
              <td className="py-3 px-4 text-[#1D1D1F]">{file.filename}</td>
              <td className="py-3 px-4 text-[#1D1D1F]">{file.filetype}</td>
              <td className="py-3 px-4 text-[#1D1D1F]">
                {new Date(file.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
