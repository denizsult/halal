import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Brand } from "@/types/api";

export const brandQueryKey = (id: number) => ["commons", "brands", id] as const;

export const getBrand = async (id: number): Promise<Brand> => {
  const response = await api.get<ApiResponse<Brand>>(
    `/v1/commons/brands/${id}`
  );
  if (!response.data.success || response.data.data == null) {
    throw new Error("Failed to fetch brand");
  }
  return response.data.data;
};

type UseBrandOptions = Omit<
  UseQueryOptions<Brand, Error>,
  "queryKey" | "queryFn"
> & { id: number };

export const useBrand = ({ id, ...options }: UseBrandOptions) => {
  return useQuery({
    queryKey: brandQueryKey(id),
    queryFn: () => getBrand(id),
    enabled: !!id,
    ...options,
  });
};
