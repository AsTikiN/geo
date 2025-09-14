/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface Pit {
  id: number;
  street: string;
  year: string;
  month: string;
  author: string | null;
  files: any[];
  jobNumber: string;
  createdAt: string;
}

interface MapProps {
  pits: Pit[];
  showPopup?: boolean;
}

interface GeocoderResult {
  geometry: {
    location: google.maps.LatLng;
  };
}

interface GeocodedPit extends Pit {
  location: google.maps.LatLng;
}

interface MapRef {
  markersRef: React.MutableRefObject<google.maps.Marker[]>;
  infoWindowsRef: React.MutableRefObject<google.maps.InfoWindow[]>;
  mapInstanceRef: React.MutableRefObject<google.maps.Map | null>;
}

const Map = forwardRef<MapRef, MapProps>(({ pits, showPopup = true }, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowsRef = useRef<google.maps.InfoWindow[]>([]);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useImperativeHandle(ref, () => ({
    markersRef,
    infoWindowsRef,
    mapInstanceRef,
  }));

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: "weekly",
        libraries: ["geocoding"],
      });

      try {
        const google = await loader.load();
        const geocoder = new google.maps.Geocoder();
        const bounds = new google.maps.LatLngBounds();

        const geocodePromises = pits.map((pit) => {
          return new Promise<GeocodedPit | null>((resolve, reject) => {
            geocoder.geocode(
              {
                address: pit.street,
                region: "pl",
              },
              (
                results: GeocoderResult[] | null,
                status: google.maps.GeocoderStatus
              ) => {
                if (status === "OK" && results && results[0]) {
                  resolve({ ...pit, location: results[0].geometry.location });
                } else {
                  reject(status);
                }
              }
            );
          });
        });

        const locations = await Promise.all(
          geocodePromises.map((p) =>
            p.catch((e) => {
              console.error("Geokodowanie nie powiodło się:", e);
              return null;
            })
          )
        );

        const validLocations = locations.filter(
          (loc): loc is GeocodedPit => loc !== null
        );

        if (validLocations.length > 0) {
          const map = new google.maps.Map(mapRef.current!, {
            zoom: 15,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });

          mapInstanceRef.current = map;

          // Dodaj niestandardowy przycisk pełnego ekranu
          const fullscreenButton = document.createElement("button");
          fullscreenButton.className =
            "absolute top-4 right-4 z-10 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors";
          fullscreenButton.innerHTML = `
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          `;
          fullscreenButton.title = "Pełny ekran";
          map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
            fullscreenButton
          );

          let isFullscreen = false;
          fullscreenButton.addEventListener("click", () => {
            if (!document.fullscreenElement) {
              mapRef.current?.requestFullscreen();
              isFullscreen = true;
            } else {
              document.exitFullscreen();
              isFullscreen = false;
            }
          });

          // Aktualizuj ikonę przycisku po zmianie stanu pełnego ekranu
          document.addEventListener("fullscreenchange", () => {
            if (document.fullscreenElement) {
              fullscreenButton.innerHTML = `
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9V4.5M9 9H4.5M15 9h4.5M15 9V4.5M9 15v4.5M9 15H4.5M15 15h4.5M15 15v4.5" />
                </svg>
              `;
            } else {
              fullscreenButton.innerHTML = `
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
              `;
            }
          });

          markersRef.current.forEach((marker) => marker.setMap(null));
          infoWindowsRef.current.forEach((window) => window.close());
          markersRef.current = [];
          infoWindowsRef.current = [];

          validLocations.forEach((result) => {
            const location = result.location;
            bounds.extend(location);

            const marker = new google.maps.Marker({
              position: location,
              map,
              title: result.id.toString(),
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 12,
                fillColor: "#0A84FF",
                fillOpacity: 1,
                strokeColor: "#FFFFFF",
                strokeWeight: 2,
              },
              animation: google.maps.Animation.DROP,
            });

            // Zapisz ID punktu w obiekcie markera
            (marker as unknown as { pitId: number }).pitId = result.id;

            if (showPopup) {
              const content = `
                <div class="p-5 max-w-[320px] bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div class="flex items-start justify-between mb-4">
                    <div>
                      <h3 class="text-lg font-semibold text-[#1D1D1F] mb-1">${
                        result.street
                      }</h3>
                      <div class="text-sm text-[#86868B]">Nr ${
                        result.jobNumber
                      }</div>
                    </div>
                    <div class="flex items-center justify-center w-8 h-8 rounded-full bg-[#0A84FF]/10">
                      <svg class="w-4 h-4 text-[#0A84FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div class="space-y-3 pt-3 border-t border-gray-100">
                    <div class="flex items-center text-sm">
                      <div class="w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F5F7] mr-3">
                        <svg class="w-4 h-4 text-[#1D1D1F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div class="text-[#1D1D1F] font-medium">${
                          result.year
                        }, ${result.month}</div>
                        <div class="text-[#86868B] text-xs">Okres</div>
                      </div>
                    </div>
                    <div class="flex items-center text-sm">
                      <div class="w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F5F7] mr-3">
                        <svg class="w-4 h-4 text-[#1D1D1F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <div class="text-[#1D1D1F] font-medium">${
                          result.files.length
                        } plików</div>
                        <div class="text-[#86868B] text-xs">Dokumenty</div>
                      </div>
                    </div>
                    <div class="flex items-center text-sm">
                      <div class="w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F5F7] mr-3">
                        <svg class="w-4 h-4 text-[#1D1D1F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div class="text-[#1D1D1F] font-medium">${new Date(
                          result.createdAt
                        ).toLocaleDateString("pl-PL")}</div>
                        <div class="text-[#86868B] text-xs">Data utworzenia</div>
                      </div>
                    </div>
                  </div>
                  <div class="mt-4 pt-4 border-t border-gray-100">
                    <a href="/preview/${
                      result.id
                    }" class="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[#0A84FF] rounded-lg hover:bg-[#0071E3] transition-colors">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Zobacz szczegóły
                    </a>
                  </div>
                </div>
              `;

              const infoWindow = new google.maps.InfoWindow({
                content,
                maxWidth: 320,
                pixelOffset: new google.maps.Size(0, -10),
              });

              marker.addListener("click", () => {
                infoWindowsRef.current.forEach((window) => window.close());
                infoWindow.open(map, marker);
                map.panTo(location);
                map.setZoom(17);
              });

              infoWindowsRef.current.push(infoWindow);
            } else {
              marker.addListener("click", () => {
                map.panTo(location);
                map.setZoom(17);
              });
            }

            markersRef.current.push(marker);
          });

          map.fitBounds(bounds);

          if (validLocations.length === 1) {
            map.setZoom(15);
          }
        }
      } catch (error) {
        console.error("Błąd podczas ładowania Google Maps:", error);
      }
    };

    initMap();
  }, [pits, showPopup]);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden relative">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
});

Map.displayName = "Map";

export { Map };
