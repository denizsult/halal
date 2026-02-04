import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { City } from "@/types/api";

export const citiesQueryKey = (countryId: number) =>
  ["commons", "countries", countryId, "cities"] as const;

export const getCities = async (countryId: number): Promise<City[]> => {
  const response = await api.get<ApiResponse<City[]>>(
    `/v1/commons/countries/${countryId}/cities`
  );
  if (!response.data.success || response.data.data == null) {
    throw new Error("Failed to fetch cities");
  }
  return response.data.data;
};

type UseCitiesOptions = Omit<
  UseQueryOptions<City[], Error>,
  "queryKey" | "queryFn"
> & { countryId: number };

export const useCities = ({ countryId, ...options }: UseCitiesOptions) => {
  return useQuery({
    queryKey: citiesQueryKey(countryId),
    queryFn: () => getCities(countryId),
    enabled: !!countryId,
    ...options,
  });
};
