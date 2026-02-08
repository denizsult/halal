import { useQuery } from "@tanstack/react-query";

import { api, getAccessToken } from "@/lib/axios";
import type { ApiResponse, UserResource } from "@/types/api";

export const profileQueryKey = ["profile"] as const;

const getProfile = async (): Promise<UserResource> => {
  const response = await api.get<ApiResponse<UserResource>>("/v1/profile");
  if (!response.data.success || response.data.data == null) {
    throw new Error("Failed to fetch profile");
  }
  return response.data.data;
};

export const useGetProfile = () => {
  return useQuery({
    queryKey: profileQueryKey,
    queryFn: getProfile,
    enabled: !!getAccessToken(),
    refetchOnMount: true,
  });
};
