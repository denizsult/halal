import { useExtendedMutation } from "@/hooks/use-extended-mutation";
import { api } from "@/lib/axios";
import type { MutationConfig } from "@/lib/react-query";
import { authActions } from "@/stores";
import type {
  ApiResponse,
  UpdateProfileRequest,
  UserResource,
} from "@/types/api";

import { profileQueryKey } from "./useGetProfile";

const updateProfile = async (
  payload: UpdateProfileRequest
): Promise<UserResource> => {
  const response = await api.put<ApiResponse<UserResource>>(
    "/v1/profile",
    payload
  );
  if (!response.data.success || response.data.data == null) {
    throw new Error("Failed to update profile");
  }
  return response.data.data;
};

export const useUpdateProfile = (
  config?: MutationConfig<typeof updateProfile>
) => {
  return useExtendedMutation({
    ...config,
    mutationFn: updateProfile,
    onSuccessMessage: "Profile updated successfully",
    onErrorMessage: "Failed to update profile",
    refetchQueries: [profileQueryKey],
    onSuccess: (data, variables, onMutateResult, context) => {
      authActions.setUser(data);
      config?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
