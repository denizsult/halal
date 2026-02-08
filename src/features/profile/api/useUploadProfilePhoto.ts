import { useExtendedMutation } from "@/hooks/use-extended-mutation";
import { api } from "@/lib/axios";
import type { MutationConfig } from "@/lib/react-query";
import { authActions } from "@/stores";
import type { ApiResponse, UserResource } from "@/types/api";

import { profileQueryKey } from "./useGetProfile";

const uploadProfilePhoto = async (file: File): Promise<UserResource> => {
  const formData = new FormData();
  formData.append("photo", file);

  const response = await api.post<ApiResponse<UserResource>>(
    "/v1/profile/photo",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  if (!response.data.success || response.data.data == null) {
    throw new Error("Failed to upload photo");
  }
  return response.data.data;
};

export const useUploadProfilePhoto = (
  config?: MutationConfig<typeof uploadProfilePhoto>
) => {
  return useExtendedMutation({
    ...config,
    mutationFn: uploadProfilePhoto,
    onSuccessMessage: "Profile photo uploaded successfully",
    onErrorMessage: "Failed to upload photo",
    refetchQueries: [profileQueryKey],
    onSuccess: (data, variables, onMutateResult, context) => {
      authActions.setUser(data);
      config?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
