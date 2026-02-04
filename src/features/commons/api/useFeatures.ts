import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Feature } from "@/types/api";

export const featuresQueryKey = (module?: string) =>
  module ? ["commons", "features", module] : (["commons", "features"] as const);

export const getFeatures = async (module?: string): Promise<Feature[]> => {
  const params = module ? { module } : undefined;
  const response = await api.get<ApiResponse<Feature[]>>(
    "/v1/commons/features",
    { params }
  );
  if (!response.data.success || response.data.data == null) {
    throw new Error("Failed to fetch features");
  }
  return response.data.data;
};

type UseFeaturesOptions = Omit<
  UseQueryOptions<Feature[], Error>,
  "queryKey" | "queryFn"
> & { module?: string };

export const useFeatures = ({
  module,
  ...options
}: UseFeaturesOptions = {}) => {
  return useQuery({
    queryKey: featuresQueryKey(module),
    queryFn: () => getFeatures(module),
    ...options,
  });
};
