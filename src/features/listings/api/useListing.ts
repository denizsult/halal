import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { getModuleListingsConfig, resolveListingUrl } from "@/module-configs";
import type { CompanyType } from "@/types/api";

export const listingQueryKey = (
  companyType: CompanyType | undefined,
  id: number
) => ["listings", companyType ?? null, id] as const;

export const getListing = async <T = unknown>(
  companyType: CompanyType | undefined,
  id: number
): Promise<T> => {
  const config = getModuleListingsConfig(companyType);
  if (!config) {
    throw new Error("No listings config for company type");
  }
  const url = resolveListingUrl(config.listings.endpoints.getById.url, id);
  const response = await api.get<{ success: boolean; data: T }>(url);
  if (!response.data.success || response.data.data == null) {
    throw new Error("Failed to fetch listing");
  }
  return response.data.data;
};

type UseListingOptions<T = unknown> = Omit<
  UseQueryOptions<T, Error>,
  "queryKey" | "queryFn"
> & {
  companyType: CompanyType | undefined;
  id: number;
};

export const useListing = <T = unknown>({
  companyType,
  id,
  ...options
}: UseListingOptions<T>) => {
  const config = getModuleListingsConfig(companyType);

  return useQuery({
    queryKey: listingQueryKey(companyType, id),
    queryFn: () => getListing<T>(companyType, id),
    enabled: !!companyType && !!config && !!id,
    ...options,
  });
};
