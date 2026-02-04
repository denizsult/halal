import { useExtendedMutation } from "@/hooks/use-extended-mutation";
import { api } from "@/lib/axios";
import type { MutationConfig } from "@/lib/react-query";
import type { ForgotPasswordRequest } from "@/types/api";

export const forgotPassword = async (
  payload: ForgotPasswordRequest
): Promise<void> => {
  await api.post("/v1/auth/forgot-password", payload);
};

export const useForgotPassword = (
  config?: MutationConfig<typeof forgotPassword>
) => {
  return useExtendedMutation({
    ...config,
    mutationFn: forgotPassword,
  });
};
