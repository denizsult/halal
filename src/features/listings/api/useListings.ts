import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { getModuleListingsConfig } from "@/module-configs";
import type { CompanyType } from "@/types/api";
import type { ListingCollection } from "@/types/api";

import type { ListingsView } from "../types";

export interface ListingsParams {
  status?: string;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  // Filter params - these are passed directly to the API
  country_id?: number | null;
  brand_id?: number | null;
  car_model_id?: number | null;
  city_id?: number | null;
  seats?: string | null;
  luggage_capacity?: string | null;
  fuel_type?: number | null;
  transmission_type?: number | null;
  price_min?: string | number;
  price_max?: string | number;
  pickup_date?: string | Date | null;
  dropoff_date?: string | Date | null;
  check_in?: string | Date | null;
  check_out?: string | Date | null;
  transfer_date?: string | Date | null;
  // Generic filter support for any additional params
  [key: string]: unknown;
}

export const listingsQueryKey = (
  companyType: CompanyType | undefined,
  params?: ListingsParams,
  view: ListingsView = "listings"
) => ["listings", companyType ?? null, view, params ?? {}] as const;

const getListingsEndpoint = (
  companyType: CompanyType | undefined,
  view: ListingsView
): string => {
  const config = getModuleListingsConfig(companyType);
  if (!config) {
    throw new Error("No listings config for company type");
  }
  const baseUrl = config.listings.endpoints.getAll.url;
  if (view === "bookings") {
    // TODO(@deniz): bookings endpoint currently returns empty payload; update when backend is ready.
    return `${baseUrl}/bookings`;
  }
  return baseUrl;
};

export const getListings = async <T = unknown>(
  companyType: CompanyType | undefined,
  params?: ListingsParams,
  view: ListingsView = "listings"
): Promise<ListingCollection<T>> => {
  const url = getListingsEndpoint(companyType, view);
  const response = await api.get<ListingCollection<T>>(url, { params });
  return response.data;
};

type UseListingsOptions<T = unknown> = Omit<
  UseQueryOptions<ListingCollection<T>, Error>,
  "queryKey" | "queryFn"
> & {
  companyType: CompanyType | undefined;
  params?: ListingsParams;
  view?: ListingsView;
};

export const useListings = <T = unknown>({
  companyType,
  params,
  view = "listings",
  ...options
}: UseListingsOptions<T>) => {
  const config = getModuleListingsConfig(companyType);
  const queryKey = listingsQueryKey(companyType, params, view);

  return useQuery({
    queryKey,
    queryFn: () => getListings<T>(companyType, params, view),
    enabled: !!companyType && !!config,
    ...options,
  });
};
