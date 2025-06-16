"use client";

import { Suspense } from "react";
import { usePits } from "../shared/hooks/usePits";
import { Map } from "../shared/modules/Map";
import Link from "next/link";
import { useRef } from "react";

interface MapRef {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  markersRef: { current: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  infoWindowsRef: { current: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapInstanceRef: { current: any };
}

function MapContent() {
  const { data: pits, isLoading } = usePits();
  const mapRef = useRef<MapRef>(null);

  const hasPdfFile = (files: { filetype: string }[]) => {
    return files.some((file) => file.filetype.toLowerCase() === "pdf");
  };

  const handlePitClick = (pitId: number) => {
    if (mapRef.current && pits) {
      const marker = mapRef.current.markersRef.current.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (marker: any) => marker.pitId === pitId
      );

      if (marker) {
        const position = marker.getPosition();
        mapRef.current.mapInstanceRef.current.panTo(position);
        mapRef.current.mapInstanceRef.current.setZoom(17);

        const markerIndex = mapRef.current.markersRef.current.indexOf(marker);
        const infoWindow = mapRef.current.infoWindowsRef.current[markerIndex];
        if (infoWindow) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          mapRef.current.infoWindowsRef.current.forEach((window: any) =>
            window.close()
          );
          infoWindow.open(mapRef.current.mapInstanceRef.current, marker);
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!pits) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] p-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Нет данных для отображения</p>
          </div>
        </div>
      </div>
    );
  }

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
              Карта дорожных работ
            </h1>
            <p className="text-gray-500">
              Просмотр всех мест проведения дорожных работ
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 min-h-[650px]">
        <div className="col-span-8 bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] p-6">
          <Map ref={mapRef} pits={pits} />
        </div>
        <div className="col-span-4 bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] p-6  ">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium text-gray-900">Список работ</h2>
            <span className="text-sm text-gray-500">{pits.length} записей</span>
          </div>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {pits.map((pit) => (
              <div
                key={pit.id}
                onClick={() => handlePitClick(pit.id)}
                className="block p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-1 h-full rounded-full ${
                      hasPdfFile(pit.files) ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {pit.street}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <span>
                        {pit.year}, {pit.month}
                      </span>
                      <span>•</span>
                      <span>{pit.files.length} файлов</span>
                    </div>
                    <div className="mt-2 flex items-center flex-wrap gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        №{pit.jobNumber}
                      </span>
                      {!hasPdfFile(pit.files) && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                          Нет PDF
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <MapContent />
    </Suspense>
  );
}
