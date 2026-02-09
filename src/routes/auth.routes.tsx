import {
  AccountTypeLazy,
  CompanyPasswordLazy,
  CompanyServicesLazy,
  CompanySignUpLazy,
  SignInLazy,
} from "./lazy-components/auth.lazy";

export const authRoutes = [
  {
    path: "/sign-in",
    element: <SignInLazy />,
  },
  {
    path: "/account-type",
    element: <AccountTypeLazy />,
  },
  {
    path: "/sign-up/company",
    element: <CompanySignUpLazy />,
  },
  {
    path: "/sign-up/company/services",
    element: <CompanyServicesLazy />,
  },
  {
    path: "/sign-up/company/passwords",
    element: <CompanyPasswordLazy />,
  },
] as const;
