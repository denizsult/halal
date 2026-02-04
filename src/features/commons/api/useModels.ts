import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { CarModel } from "@/types/api";

export const modelsQueryKey = (brandId: number) =>
  ["commons", "brands", brandId, "models"] as const;

export const getModels = async (brandId: number): Promise<CarModel[]> => {
  const response = await api.get<ApiResponse<CarModel[]>>(
    `/v1/commons/brands/${brandId}/models`
  );
  if (!response.data.success || response.data.data == null) {
    throw new Error("Failed to fetch models");
  }
  return response.data.data;
};

type UseModelsOptions = Omit<
  UseQueryOptions<CarModel[], Error>,
  "queryKey" | "queryFn"
> & { brandId: number };

export const useModels = ({ brandId, ...options }: UseModelsOptions) => {
  return useQuery({
    queryKey: modelsQueryKey(brandId),
    queryFn: () => getModels(brandId),
    enabled: !!brandId,
    ...options,
  });
};
