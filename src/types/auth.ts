/**
 * Auth types for app usage. Aligned with OpenAPI; User mirrors UserResource.
 */
import type {
  AuthResponse,
  AuthResponseData,
  CompanyResource,
  LoginRequest,
  RegisterRequest,
  UserResource,
} from "./api";

// Use API resource types as app types
export type User = UserResource;
export type Company = CompanyResource;

export type LoginDto = LoginRequest;
export type RegisterDto = RegisterRequest;

export interface LoginResponse extends AuthResponse {}
export type { AuthResponseData };
