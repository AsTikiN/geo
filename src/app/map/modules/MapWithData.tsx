"use client";

import { Suspense, useRef } from "react";
import { Map } from "./Map";
import { useQuery } from "@tanstack/react-query";
import { Pit } from "../../preview/[id]/types";
import { useSearchParams } from "next/navigation";

interface MapRef {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  markersRef: { current: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  infoWindowsRef: { current: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapInstanceRef: { current: any };
}

interface MapPitsResponse {
  pits: Pit[];
  totalCount: number;
}

// Custom hook to fetch all pits for the map
const useMapPits = () => {
  const searchParams = useSearchParams();
  
  return useQuery<MapPitsResponse>({
    queryKey: ["map-pits", searchParams.toString()],
    queryFn: async () => {
      const params = new URLSearchParams(searchParams.toString());
      const response = await fetch(`/api/map-pits?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch map pits");
      }
      return response.json();
    },
  });
};

export function MapWithData() {
  const { data, isLoading } = useMapPits();
  const mapRef = useRef<MapRef>(null);

  const hasPdfFile = (files: { filetype: string }[]) => {
    return files.some((file) => file.filetype.toLowerCase() === "pdf");
  };

  const handlePitClick = (pitId: number) => {
    if (mapRef.current && data?.pits) {
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
          // Check if this info window is already open
          const isCurrentlyOpen = infoWindow.getMap() !== null;

          // Close all info windows first
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          mapRef.current.infoWindowsRef.current.forEach((window: any) =>
            window.close()
          );

          // If it wasn't open, open it now
          if (!isCurrentlyOpen) {
            infoWindow.open(mapRef.current.mapInstanceRef.current, marker);
          }
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[650px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data?.pits) {
    return (
      <div className="flex items-center justify-center min-h-[650px]">
        <div className="text-center py-8">
          <p className="text-gray-500">Brak danych do wyświetlenia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-8 min-h-[650px]">
      <div className="col-span-8 bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] p-6">
        <Map ref={mapRef} pits={data.pits} />
      </div>
      <div className="col-span-4 bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium text-gray-900">Lista robót</h2>
          <span className="text-sm text-gray-500">
            {data.pits.length} wpisów
          </span>
        </div>
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
          {data.pits.map((pit) => (
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
                    <span>{pit.files.length} plików</span>
                  </div>
                  <div className="mt-2 flex items-center flex-wrap gap-2">
                    {!hasPdfFile(pit.files) && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                        Brak PDF
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
  );
}
