import { useQueryClient } from "@tanstack/react-query";

import { useExtendedMutation } from "@/hooks/use-extended-mutation";
import { api } from "@/lib/axios";
import type { MutationConfig } from "@/lib/react-query";
import { getModuleListingsConfig } from "@/module-configs";
import type { CompanyType } from "@/types/api";

interface CreateListingResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export const createListing = async <T = unknown>(
  companyType: CompanyType | undefined,
  payload: Record<string, unknown>
): Promise<CreateListingResponse<T>> => {
  const config = getModuleListingsConfig(companyType);
  if (!config) {
    throw new Error("No listings config for company type");
  }
  const url = config.listings.endpoints.create.url;
  const response = await api.post<CreateListingResponse<T>>(url, payload);
  return response.data;
};

type CreateListingMutationFn = (
  payload: Record<string, unknown>
) => Promise<CreateListingResponse>;

export const useCreateListing = <T = unknown>(
  companyType: CompanyType | undefined,
  config?: MutationConfig<CreateListingMutationFn>
) => {
  const queryClient = useQueryClient();

  return useExtendedMutation({
    ...config,
    mutationFn: (payload: Record<string, unknown>) =>
      createListing<T>(companyType, payload),
    onSuccess: (data, variables, context, mutationContext) => {
      queryClient.invalidateQueries({
        queryKey: ["listings", companyType ?? null],
      });
      config?.onSuccess?.(data, variables, context, mutationContext);
    },
  });
};
