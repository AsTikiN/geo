"use client";

import Link from "next/link";
import { Table } from "./shared/components/Table";
import { Filters } from "./shared/components/Filters";
import { usePits } from "./shared/hooks/usePits";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

function HomeContent() {
  const { data: pits, isLoading, error } = usePits();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-medium text-blue-900 mb-2">
              Документы
            </h1>
            <p className="text-gray-500">Управление дорожными работами</p>
          </div>

          <Link
            href="/add"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-[#0071E3] rounded-2xl hover:bg-[#0077ED] transition-colors shadow-[0_10px_20px_rgba(0,113,227,0.15)]"
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

        <Filters />

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-gray-500 mt-2">Загрузка...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Произошла ошибка при загрузке данных</p>
          </div>
        ) : pits && pits.length > 0 ? (
          <Table pits={pits} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Нет данных для отображения. Попробуйте изменить параметры поиска
              или добавьте новую запись.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <HomeContent />
    </QueryClientProvider>
  );
}
