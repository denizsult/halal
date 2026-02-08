import { type ReactNode, useEffect, useState } from "react";
import { isAxiosError } from "axios";

import { useUser } from "@/features/Auth/api/useUser";
import { clearTokens, getAccessToken } from "@/lib/axios";
import { authActions } from "@/stores";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { data: user, isLoading, error, isSuccess } = useUser();
  const allowLocalUser =
    import.meta.env.DEV && import.meta.env.VITE_ENABLE_API_MOCKS !== "false";
  const [isBannerDismissed, setIsBannerDismissed] = useState(() => {
    if (!allowLocalUser) return true;
    return localStorage.getItem("devBannerDismissed") === "true";
  });

  // User geldiğinde Valtio store'u güncelle
  useEffect(() => {
    if (isSuccess && user) {
      authActions.setUser(user);
    }
  }, [user, isSuccess]);

  // Token yoksa kullanıcıyı temizle
  useEffect(() => {
    if (getAccessToken()) return;
    if (allowLocalUser) {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Parameters<
            typeof authActions.setUser
          >[0];
          authActions.setUser(parsed);
          return;
        } catch {
          localStorage.removeItem("user");
        }
      }
    }
    authActions.clearUser();
  }, [allowLocalUser]);

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

  return (
    <>
      {allowLocalUser && !isBannerDismissed && (
        <div className="fixed top-4 left-1/2 z-[9999] -translate-x-1/2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-900 shadow-sm">
          <div className="flex items-center gap-3">
            <span>
              Dev mode: using local user session and mocked API responses.
            </span>
            <button
              type="button"
              onClick={() => {
                localStorage.setItem("devBannerDismissed", "true");
                setIsBannerDismissed(true);
              }}
              className="text-amber-900/60 hover:text-amber-900"
              aria-label="Dismiss banner"
            >
              ×
            </button>
          </div>
        </div>
      )}
      {children}
    </>
  );
};
