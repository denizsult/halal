import { lazy } from "react";

export const SignInLazy = lazy(
  () =>
    import("@/features/Auth/pages/sign-in").then((module) => ({
      default: module.SignInPage,
    })) as Promise<{ default: React.ComponentType<unknown> }>
);

export const AccountTypeLazy = lazy(
  () =>
    import("@/features/Auth/pages/account-type").then((module) => ({
      default: module.AccountTypePage,
    })) as Promise<{ default: React.ComponentType<unknown> }>
);

export const CompanySignUpLazy = lazy(
  () =>
    import("@/features/Auth/pages/company-sign-up").then((module) => ({
      default: module.CompanySignUpPage,
    })) as Promise<{ default: React.ComponentType<unknown> }>
);

export const CompanyServicesLazy = lazy(
  () =>
    import("@/features/Auth/pages/company-services").then((module) => ({
      default: module.CompanyServicesPage,
    })) as Promise<{ default: React.ComponentType<unknown> }>
);

export const CompanyPasswordLazy = lazy(
  () =>
    import("@/features/Auth/pages/company-password").then((module) => ({
      default: module.CompanyPasswordPage,
    })) as Promise<{ default: React.ComponentType<unknown> }>
);
