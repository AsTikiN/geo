"use client";

import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface MapProps {
  address: string;
}

export const Map = ({ address }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: "AIzaSyBpFBe9xQa9BlrfC0tVgLlVib1VfNPjZYA",
        // process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
        version: "weekly",
      });

      try {
        const google = await loader.load();
        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ address }, (results: any, status: any) => {
          if (status === "OK" && results && results[0]) {
            const location = results[0].geometry.location;
            const map = new google.maps.Map(mapRef.current!, {
              center: location,
              zoom: 15,
              styles: [
                {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }],
                },
              ],
            });

            new google.maps.Marker({
              position: location,
              map,
              title: address,
            });
          } else {
            console.error(
              "Geocode was not successful for the following reason:",
              status
            );
          }
        });
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
    };

    initMap();
  }, [address]);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};
