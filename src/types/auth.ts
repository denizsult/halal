/**
 * Auth types for app usage. Aligned with OpenAPI; User mirrors UserResource.
 */
import type {
  AuthResponse,
  AuthResponseData,
  CompanyResource,
  LoginRequest,
  RegisterRequest,
  RegisterRequest,
  UserRegisterRequest,
  UserResource,
} from "./api";

// Use API resource types as app types
export type User = UserResource;
export type Company = CompanyResource;

export type LoginDto = LoginRequest;
export type RegisterDto = RegisterRequest;
export type UserRegisterDto = UserRegisterRequest;

export interface LoginResponse extends AuthResponse {}
export type { AuthResponseData };
