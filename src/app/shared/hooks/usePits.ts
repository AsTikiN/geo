import { Pit } from "@/app/preview/[id]/types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface PitsResponse {
  pits: Pit[];
  pagination: PaginationInfo;
}

export function usePits() {
  const searchParams = useSearchParams();

  return useQuery<PitsResponse>({
    queryKey: ["pits", Object.fromEntries(searchParams.entries())],
    queryFn: async () => {
      const params = new URLSearchParams(searchParams);
      const response = await fetch(`/api/pits-list?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch pits");
      }
      return response.json();
    },
  });
}
