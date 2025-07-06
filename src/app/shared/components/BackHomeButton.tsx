"use client";

import { useRouter } from "next/navigation";

export const BackHomeButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/documents")}
      className="mb-8 flex cursor-pointer items-center text-[#1D1D1F] hover:text-[#0066CC] transition-colors"
    >
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      Назад
    </button>
  );
};
