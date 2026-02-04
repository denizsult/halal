import { useQueryClient } from "@tanstack/react-query";

import { useExtendedMutation } from "@/hooks/use-extended-mutation";
import { api } from "@/lib/axios";
import type { MutationConfig } from "@/lib/react-query";
import { getModuleListingsConfig, resolveListingUrl } from "@/module-configs";
import type { CompanyType } from "@/types/api";

import { listingQueryKey } from "./useListing";

interface DeleteListingResponse {
  success: boolean;
  message: string;
}

export const deleteListing = async (
  companyType: CompanyType | undefined,
  id: number
): Promise<DeleteListingResponse> => {
  const config = getModuleListingsConfig(companyType);
  if (!config) {
    throw new Error("No listings config for company type");
  }
  const url = resolveListingUrl(config.listings.endpoints.delete.url, id);
  const response = await api.delete<DeleteListingResponse>(url);
  return response.data;
};

export const useDeleteListing = (
  companyType: CompanyType | undefined,
  config?: MutationConfig<(id: number) => Promise<DeleteListingResponse>>
) => {
  const queryClient = useQueryClient();

  return useExtendedMutation({
    ...config,
    mutationFn: (id: number) => deleteListing(companyType, id),
    onSuccess: (data, id, context, mutationContext) => {
      queryClient.removeQueries({
        queryKey: listingQueryKey(companyType ?? undefined, id),
      });
      queryClient.invalidateQueries({
        queryKey: ["listings", companyType ?? null],
      });
      config?.onSuccess?.(data, id, context, mutationContext);
    },
  });
};
