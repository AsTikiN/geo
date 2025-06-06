import { useQuery } from "@tanstack/react-query";
import { pitApi } from "../api/pitApi";

export const usePitData = (id: string) => {
  return useQuery({
    queryKey: ["pit", id],
    queryFn: () => pitApi.getPit(id),
  });
};
