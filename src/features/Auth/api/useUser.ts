import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { api, getAccessToken } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { User } from "@/types/auth";

export const userQueryKey = ["auth", "user"] as const;

export const getUser = async (): Promise<User> => {
  const response = await api.get<ApiResponse<User>>("/v1/auth/me");
  if (!response.data.success || response.data.data == null) {
    throw new Error("Failed to fetch user");
  }
  return response.data.data;
};

type UseUserOptions = Omit<
  UseQueryOptions<User, Error>,
  "queryKey" | "queryFn"
>;

export const useUser = (options?: UseUserOptions) => {
  return useQuery({
    queryKey: userQueryKey,
    queryFn: getUser,
    enabled: !!getAccessToken(),
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};
