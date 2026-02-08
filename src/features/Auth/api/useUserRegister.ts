import { useNavigate } from "react-router-dom";

import { useExtendedMutation } from "@/hooks/use-extended-mutation";
import { api, setTokens } from "@/lib/axios";
import type { MutationConfig } from "@/lib/react-query";
import { authActions } from "@/stores";
import type { AuthResponse } from "@/types/api";
import type { UserRegisterDto } from "@/types/auth";

export const userRegister = async (
  payload: UserRegisterDto
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/v1/auth/register", payload);
  const { data } = response.data;
  if (data?.access_token && data?.refresh_token) {
    setTokens(data.access_token, data.refresh_token);
  }
  return response.data;
};

export const useUserRegister = (
  config?: MutationConfig<typeof userRegister>
) => {
  const navigate = useNavigate();

  return useExtendedMutation({
    ...config,
    mutationFn: userRegister,
    onSuccess: (data, variables, onMutateResult, context) => {
      const user = data.data?.user;
      if (user) {
        authActions.setUser(user);
      }
      navigate("/");
      config?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
