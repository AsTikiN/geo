"use client";

import { Table } from "./Table";
import { Filters } from "./Filters";
import { usePits } from "../hooks/usePits";

export function PitList() {
  const { data: pits, isLoading, error } = usePits();

  const hasPdfFile = (files: { filetype: string }[]) => {
    return files.some((file) => file.filetype.toLowerCase() === "pdf");
  };

  return (
    <div>
      <Filters />

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-gray-500 mt-2">Ładowanie...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">Wystąpił błąd podczas ładowania danych</p>
        </div>
      ) : pits && pits.length > 0 ? (
        <Table pits={pits} hasPdfFile={hasPdfFile} />
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            Brak danych do wyświetlenia. Spróbuj zmienić parametry wyszukiwania
            lub dodaj nowy wpis.
          </p>
        </div>
      )}
    </div>
  );
}
