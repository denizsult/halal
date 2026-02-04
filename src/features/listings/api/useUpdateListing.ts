import { useQueryClient } from "@tanstack/react-query";

import { useExtendedMutation } from "@/hooks/use-extended-mutation";
import { api } from "@/lib/axios";
import type { MutationConfig } from "@/lib/react-query";
import { getModuleListingsConfig, resolveListingUrl } from "@/module-configs";
import type { CompanyType } from "@/types/api";

import { listingQueryKey } from "./useListing";

interface UpdateListingResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export const updateListing = async <T = unknown>(
  companyType: CompanyType | undefined,
  id: number,
  payload: Record<string, unknown>
): Promise<UpdateListingResponse<T>> => {
  const config = getModuleListingsConfig(companyType);
  if (!config) {
    throw new Error("No listings config for company type");
  }
  const url = resolveListingUrl(config.listings.endpoints.update.url, id);
  const response = await api.put<UpdateListingResponse<T>>(url, payload);
  return response.data;
};

export type UpdateListingVariables = {
  id: number;
  payload: Record<string, unknown>;
};

type UpdateListingMutationFn = (
  variables: UpdateListingVariables
) => Promise<UpdateListingResponse>;

export const useUpdateListing = <T = unknown>(
  companyType: CompanyType | undefined,
  config?: MutationConfig<UpdateListingMutationFn>
) => {
  const queryClient = useQueryClient();

  return useExtendedMutation({
    ...config,
    mutationFn: ({ id, payload }: UpdateListingVariables) =>
      updateListing<T>(companyType, id, payload),
    onSuccess: (data, variables, context, mutationContext) => {
      queryClient.invalidateQueries({
        queryKey: listingQueryKey(companyType ?? undefined, variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: ["listings", companyType ?? null],
      });
      config?.onSuccess?.(data, variables, context, mutationContext);
    },
  });
};
