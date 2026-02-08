import { useQuery } from "@tanstack/react-query";

import { api, getAccessToken } from "@/lib/axios";
import type { ApiResponse, CompanyResource } from "@/types/api";

export const companyQueryKey = ["profile", "company"] as const;

const getCompany = async (): Promise<CompanyResource> => {
  const response = await api.get<ApiResponse<CompanyResource>>(
    "/v1/profile/company"
  );
  if (!response.data.success || response.data.data == null) {
    throw new Error("Failed to fetch company");
  }
  return response.data.data;
};

export const useGetCompany = () => {
  return useQuery({
    queryKey: companyQueryKey,
    queryFn: getCompany,
    enabled: !!getAccessToken(),
    refetchOnMount: true,
  });
};
