import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { api, clearTokens, getRefreshToken } from "@/lib/axios";
import { authActions } from "@/stores";

export const logoutApi = async (
  refreshToken?: string | null
): Promise<void> => {
  try {
    await api.post("/v1/auth/logout", {
      refresh_token: refreshToken ?? getRefreshToken(),
    });
  } finally {
    clearTokens();
    authActions.clearUser();
  }
};

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = useCallback(() => {
    clearTokens();
    authActions.clearUser();
    navigate("/sign-in");
  }, [navigate]);

  const logoutWithApi = useCallback(async () => {
    await logoutApi();
    navigate("/sign-in");
  }, [navigate]);

  return { logout, logoutWithApi };
};
