import { useExtendedMutation } from "@/hooks/use-extended-mutation";
import { api } from "@/lib/axios";
import type { MutationConfig } from "@/lib/react-query";
import type { ChangePasswordRequest } from "@/types/api";

export const changePassword = async (
  payload: ChangePasswordRequest
): Promise<void> => {
  await api.post("/v1/auth/change-password", payload);
};

export const useChangePassword = (
  config?: MutationConfig<typeof changePassword>
) => {
  return useExtendedMutation({
    ...config,
    mutationFn: changePassword,
  });
};
