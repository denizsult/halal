import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Country } from "@/types/api";

export const countriesQueryKey = ["commons", "countries"] as const;

export const getCountries = async (): Promise<Country[]> => {
  const response = await api.get<ApiResponse<Country[]>>(
    "/v1/commons/countries"
  );
  if (!response.data.success || response.data.data == null) {
    throw new Error("Failed to fetch countries");
  }
  return response.data.data;
};

type UseCountriesOptions = Omit<
  UseQueryOptions<Country[], Error>,
  "queryKey" | "queryFn"
>;

export const useCountries = (options?: UseCountriesOptions) => {
  return useQuery({
    queryKey: countriesQueryKey,
    queryFn: getCountries,
    ...options,
  });
};
