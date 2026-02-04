import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api, clearTokens } from "@/lib/axios";
import { authActions } from "@/stores";

import { userQueryKey } from "./useUser";

export const logoutAllApi = async (): Promise<void> => {
  await api.post("/v1/auth/logout-all");
  clearTokens();
  authActions.clearUser();
};

export const useLogoutAll = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutAllApi,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: userQueryKey });
      navigate("/sign-in");
    },
  });
};
