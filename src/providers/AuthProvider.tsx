import { type ReactNode,useEffect } from "react";
import { isAxiosError } from "axios";

import { useUser } from "@/features/Auth/api/useUser";
import { clearTokens, getAccessToken } from "@/lib/axios";
import { authActions } from "@/stores";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { data: user, isLoading, error, isSuccess } = useUser();

  // User geldiğinde Valtio store'u güncelle
  useEffect(() => {
    if (isSuccess && user) {
      authActions.setUser(user);
    }
  }, [user, isSuccess]);

  // 401 hatası → logout
  useEffect(() => {
    if (error && isAxiosError(error) && error.response?.status === 401) {
      authActions.clearUser();
      clearTokens();
    }
  }, [error]);

  // Token varsa ve loading'deyse spinner göster
  if (isLoading && getAccessToken()) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
};
