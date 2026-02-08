import { useExtendedMutation } from "@/hooks/use-extended-mutation";
import { api } from "@/lib/axios";
import type { MutationConfig } from "@/lib/react-query";
import type {
  ApiResponse,
  CompanyResource,
  UpdateCompanyRequest,
} from "@/types/api";

import { companyQueryKey } from "./useGetCompany";

const updateCompany = async (
  payload: UpdateCompanyRequest
): Promise<CompanyResource> => {
  const response = await api.put<ApiResponse<CompanyResource>>(
    "/v1/profile/company",
    payload
  );
  if (!response.data.success || response.data.data == null) {
    throw new Error("Failed to update company");
  }
  return response.data.data;
};

export const useUpdateCompany = (
  config?: MutationConfig<typeof updateCompany>
) => {
  return useExtendedMutation({
    ...config,
    mutationFn: updateCompany,
    onSuccessMessage: "Company updated successfully",
    onErrorMessage: "Failed to update company",
    refetchQueries: [companyQueryKey],
  });
};
