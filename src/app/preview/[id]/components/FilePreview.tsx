"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { File } from "../types";

interface FilePreviewProps {
  file: File;
}

export function FilePreview({ file }: FilePreviewProps) {
  const [storagePath, setStoragePath] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>("");

  useEffect(() => {
    const fetchStoragePath = async () => {
      try {
        const response = await fetch("/api/config/storage-path");
        console.log("response", response);
        if (response.ok) {
          const data = await response.json();
          setStoragePath(data.storagePath);
          // Użyj ścieżki pliku bezpośrednio, ponieważ API obsługuje ścieżkę przechowywania wewnętrznie
          setFileUrl(`/api/files/${encodeURIComponent(file.filepath)}`);
        }
      } catch (error) {
        console.error("Błąd podczas pobierania ścieżki przechowywania:", error);
        // Powrót do oryginalnego URL w przypadku niepowodzenia pobierania ścieżki
        setFileUrl(`/api/files/${file.filepath}`);
      }
    };

    fetchStoragePath();
  }, [file.filepath]);

  console.log("file.filepath", file.filepath);
  console.log("storagePath", storagePath);
  console.log("fileUrl", fileUrl);

  const handleOpenFolder = async () => {
    try {
      const response = await fetch(
        `/api/files/open-location?path=${encodeURIComponent(file.filepath)}`
      );
      if (!response.ok) {
        throw new Error("Nie udało się otworzyć folderu");
      }
    } catch (error) {
      console.error("Błąd podczas otwierania folderu:", error);
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
      <p className="text-[#86868B]">Podgląd niedostępny</p>
      <div className="flex flex-col items-center gap-4">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600"
        >
          Pobierz plik
        </a>
        <button
          onClick={handleOpenFolder}
          className="text-blue-500 hover:text-blue-600 cursor-pointer"
        >
          Otwórz folder z plikiem
        </button>
      </div>
    </div>
  );
}
