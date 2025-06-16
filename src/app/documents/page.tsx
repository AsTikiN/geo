"use client";

import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PitList } from "../shared/components/PitList";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function DocumentsContent() {
  const queryClient = useQueryClient();

  const syncMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/sync-filesystem");
      if (!response.ok) throw new Error("Failed to sync filesystem");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pits"] });
      toast.success("Файловая система успешно синхронизирована");
    },
    onError: (error) => {
      console.error("Error syncing filesystem:", error);
      toast.error("Ошибка при синхронизации файловой системы");
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-medium text-blue-900 mr-4">Документы</h1>
          <p className="text-gray-500">Управление документами дорожных работ</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => syncMutation.mutate()}
            disabled={syncMutation.isPending}
            className="flex items-center px-6 py-3 text-base font-medium text-white bg-[#34C759] rounded-2xl hover:bg-[#30B350] transition-colors shadow-[0_10px_20px_rgba(52,199,89,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {syncMutation.isPending ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Синхронизация...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Синхронизировать
              </>
            )}
          </button>

          <Link
            href="/add"
            className="flex items-center px-6 py-3 text-base font-medium text-white bg-[#0071E3] rounded-2xl hover:bg-[#0077ED] transition-colors shadow-[0_10px_20px_rgba(0,113,227,0.15)]"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Добавить запись
          </Link>
        </div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <PitList />
      </Suspense>
    </div>
  );
}

export default function Documents() {
  return <DocumentsContent />;
}
