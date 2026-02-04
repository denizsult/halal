import { useExtendedMutation } from "@/hooks/use-extended-mutation";
import { api } from "@/lib/axios";
import type { MutationConfig } from "@/lib/react-query";
import type { ResetPasswordRequest } from "@/types/api";

export const resetPassword = async (
  payload: ResetPasswordRequest
): Promise<void> => {
  await api.post("/v1/auth/reset-password", payload);
};

export const useResetPassword = (
  config?: MutationConfig<typeof resetPassword>
) => {
  return useExtendedMutation({
    ...config,
    mutationFn: resetPassword,
  });
};
