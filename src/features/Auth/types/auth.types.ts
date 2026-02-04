export type AccountType = "user" | "company";

// Re-export app User from central types (OpenAPI UserResource)
export type { User } from "@/types/auth";

export interface AuthState {
  user: import("@/types/auth").User | null;
  isAuthenticated: boolean;
}
