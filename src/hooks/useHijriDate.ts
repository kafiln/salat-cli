import { getHijriDate } from "#services/utils/hijri";
import { useQuery } from "@tanstack/react-query";

export const useHijriDate = () => {
  const query = useQuery({
    queryKey: ["hijriDate"],
    queryFn: async () => {
      const result = await getHijriDate();
      return result.date;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24, // garbage collection after 24 hours
  });

  return {
    hijriDate: query.data ?? null,
    error: query.error?.message ?? null,
    loading: query.isPending,
  };
};
