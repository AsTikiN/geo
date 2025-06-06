import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

interface Pit {
  id: string;
  year: number;
  month: number;
  street: string;
  createdAt: string;
  updatedAt: string;
  files: {
    id: string;
    filename: string;
    filetype: string;
    createdAt: string;
  }[];
}

export function usePits() {
  const searchParams = useSearchParams();

  return useQuery<Pit[]>({
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
