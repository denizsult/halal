import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Brand } from "@/types/api";

export const brandsQueryKey = ["commons", "brands"] as const;

export const getBrands = async (): Promise<Brand[]> => {
  const response = await api.get<ApiResponse<Brand[]>>("/v1/commons/brands");
  if (!response.data.success || response.data.data == null) {
    throw new Error("Failed to fetch brands");
  }
  return response.data.data;
};

type UseBrandsOptions = Omit<
  UseQueryOptions<Brand[], Error>,
  "queryKey" | "queryFn"
>;

export const useBrands = (options?: UseBrandsOptions) => {
  return useQuery({
    queryKey: brandsQueryKey,
    queryFn: getBrands,
    ...options,
  });
};
