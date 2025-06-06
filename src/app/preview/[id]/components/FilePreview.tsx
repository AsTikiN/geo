"use client";

import Image from "next/image";
import { File } from "../types";

interface FilePreviewProps {
  file: File;
}

export function FilePreview({ file }: FilePreviewProps) {
  const fileUrl = `/api/files/${file.filepath}`;

  const handleOpenFolder = async () => {
    try {
      const response = await fetch(
        `/api/files/open-location?path=${encodeURIComponent(file.filepath)}`
      );
      if (!response.ok) {
        throw new Error("Failed to open folder");
      }
    } catch (error) {
      console.error("Error opening folder:", error);
    }
  };

  if (file.filetype.includes("image")) {
    return (
      <div className="relative h-full w-full">
        <Image
          src={fileUrl}
          alt={file.filename}
          fill
          className="object-contain"
        />
      </div>
    );
  }

  if (file.filetype.includes("pdf")) {
    return (
      <iframe src={fileUrl} className="w-full h-full" title={file.filename} />
    );
  }

  if (
    file.filetype.includes("word") ||
    file.filetype.includes("excel") ||
    file.filetype.includes("powerpoint")
  ) {
    return (
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
          window.location.origin + fileUrl
        )}`}
        className="w-full h-full"
        title={file.filename}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <p className="text-[#86868B]">Предпросмотр недоступен</p>
      <div className="flex flex-col items-center gap-4">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600"
        >
          Скачать файл
        </a>
        <button
          onClick={handleOpenFolder}
          className="text-blue-500 hover:text-blue-600 cursor-pointer"
        >
          Открыть папку с файлом
        </button>
      </div>
    </div>
  );
}
