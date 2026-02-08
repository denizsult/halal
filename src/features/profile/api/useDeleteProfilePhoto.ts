import { useExtendedMutation } from "@/hooks/use-extended-mutation";
import { api } from "@/lib/axios";
import type { MutationConfig } from "@/lib/react-query";
import { authActions } from "@/stores";
import type { ApiResponse, UserResource } from "@/types/api";

import { profileQueryKey } from "./useGetProfile";

const deleteProfilePhoto = async (): Promise<UserResource> => {
  const response =
    await api.delete<ApiResponse<UserResource>>("/v1/profile/photo");
  if (!response.data.success || response.data.data == null) {
    throw new Error("Failed to delete photo");
  }
  return response.data.data;
};

export const useDeleteProfilePhoto = (
  config?: MutationConfig<typeof deleteProfilePhoto>
) => {
  return useExtendedMutation({
    ...config,
    mutationFn: deleteProfilePhoto,
    onSuccessMessage: "Profile photo removed",
    onErrorMessage: "Failed to remove photo",
    refetchQueries: [profileQueryKey],
    onSuccess: (data, variables, onMutateResult, context) => {
      authActions.setUser(data);
      config?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
