import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import type { ApiResponse, PlaceDetails } from "@/types/api";

export const locationDetailsQueryKey = (placeId: string) =>
  ["commons", "locations", "details", placeId] as const;

const getLocationDetails = async (placeId: string): Promise<PlaceDetails> => {
  const response = await api.get<ApiResponse<PlaceDetails>>(
    `/v1/commons/locations/${placeId}/details`
  );
  if (!response.data.success || response.data.data == null) {
    throw new Error("Failed to fetch place details");
  }
  return response.data.data;
};

export const useLocationDetails = (placeId: string) => {
  return useQuery({
    queryKey: locationDetailsQueryKey(placeId),
    queryFn: () => getLocationDetails(placeId),
    enabled: !!placeId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};
