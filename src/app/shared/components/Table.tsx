"use client";

import { Pit } from "@/app/preview/[id]/types";
import Link from "next/link";

interface TableProps {
  pits: Pit[];
  hasPdfFile: (files: { filetype: string }[]) => boolean;
}

export function Table({ pits, hasPdfFile }: TableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-8 py-5 text-left text-sm font-medium text-gray-600">
                Rok
              </th>
              <th className="px-8 py-5 text-left text-sm font-medium text-gray-600">
                Miesiąc
              </th>
              <th className="px-8 py-5 text-left text-sm font-medium text-gray-600">
                Adres
              </th>
              <th className="px-8 py-5 text-left text-sm font-medium text-gray-600">
                Ostatnia modyfikacja
              </th>
              <th className="px-8 py-5 text-left text-sm font-medium text-gray-600">
                Pliki
              </th>
              <th className="px-8 py-5 text-left text-sm font-medium text-gray-600">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody>
            {pits.map((pit) => (
              <tr
                key={pit.id}
                className="group transition-colors hover:bg-blue-50"
              >
                <td className="px-8 py-6 text-sm text-gray-900">{pit.year}</td>
                <td className="px-8 py-6 text-sm text-gray-900">{pit.month}</td>
                <td className="px-8 py-6">
                  <div className="text-sm text-gray-900 font-medium">
                    {pit.street.split("_")[0]} {pit.street.split("_")[1]}
                  </div>
                </td>
                <td className="px-8 py-6 text-sm text-gray-500">
                  {pit.lastFileModification
                    ? new Date(pit.lastFileModification).toLocaleDateString(
                        "pl-PL",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )
                    : new Date(pit.createdAt).toLocaleDateString("pl-PL", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                </td>
                <td className="px-8 py-6">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      hasPdfFile(pit.files)
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {pit.files.length}
                  </span>
                </td>
                <td className="px-8 py-6 space-x-2 flex gap-2 flex-wrap">
                  <Link
                    href={`/preview/${pit.id}`}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Podgląd
                  </Link>
                  <Link
                    href={`/edit/${pit.id}`}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edytuj
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
