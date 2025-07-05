"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="flex">
        {/* Pasek boczny */}
        <div className="w-72 min-h-screen bg-white shadow-[0_10px_20px_rgba(0,113,227,0.15)] p-8">
          <div className="mb-12">
            <h1 className="text-3xl font-medium text-blue-900 mb-2">
              Geotechnika
            </h1>
            <p className="text-gray-500">Zarządzanie dokumentami</p>
          </div>

          <nav className="space-y-3">
            <Link
              href="/documents"
              className={`flex items-center px-5 py-4 text-base font-medium rounded-2xl transition-all duration-200 ${
                isActive("/documents")
                  ? "bg-[#0071E3] text-white shadow-[0_4px_12px_rgba(0,113,227,0.3)]"
                  : "text-gray-700 hover:bg-gray-50 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
              }`}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Dokumenty
            </Link>

            <Link
              href="/reports"
              className={`flex items-center px-5 py-4 text-base font-medium rounded-2xl transition-all duration-200 ${
                isActive("/reports")
                  ? "bg-[#0071E3] text-white shadow-[0_4px_12px_rgba(0,113,227,0.3)]"
                  : "text-gray-700 hover:bg-gray-50 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
              }`}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Raporty
            </Link>

            <Link
              href="/map"
              className={`flex items-center px-5 py-4 text-base font-medium rounded-2xl transition-all duration-200 ${
                isActive("/map")
                  ? "bg-[#0071E3] text-white shadow-[0_4px_12px_rgba(0,113,227,0.3)]"
                  : "text-gray-700 hover:bg-gray-50 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
              }`}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              Mapa
            </Link>
          </nav>
        </div>

        {/* Główna treść */}
        <div className="flex-1 p-12">
          <div className="mx-auto">{children}</div>
        </div>
      </div>

      {/* Kontener powiadomień */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
