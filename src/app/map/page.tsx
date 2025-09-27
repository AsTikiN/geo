"use client";

import { Suspense } from "react";
import Link from "next/link";
import { MapWithData } from "./modules/MapWithData";
import { Filters } from "./modules/Filters";

function MapContent() {
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
              Mapa robót geologicznych
            </h1>
            <p className="text-gray-500">Zobacz wszystkie prace geologiczne</p>
          </div>
        </div>
      </div>

      <Filters />
      <MapWithData />
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
