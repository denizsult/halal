import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import type { ApiResponse, LocationPrediction } from "@/types/api";

export const locationAutocompleteQueryKey = (query: string) =>
  ["commons", "locations", "autocomplete", query] as const;

const getLocationAutocomplete = async (
  query: string
): Promise<LocationPrediction[]> => {
  const response = await api.get<ApiResponse<LocationPrediction[]>>(
    "/v1/commons/locations/autocomplete",
    { params: { query } }
  );
  if (!response.data.success || response.data.data == null) {
    throw new Error("Failed to fetch locations");
  }
  return response.data.data;
};

export const useLocationAutocomplete = (query: string) => {
  return useQuery({
    queryKey: locationAutocompleteQueryKey(query),
    queryFn: () => getLocationAutocomplete(query),
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
