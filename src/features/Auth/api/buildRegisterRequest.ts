import type { RegisterRequest } from "@/types/api";

import type { RegistrationState } from "../types/registration.types";
import { SERVICE_TYPE_TO_API } from "../types/registration.types";

/**
 * Builds OpenAPI RegisterRequest from registration store state.
 * Use when submitting the final registration form (e.g. password step).
 */
export function buildRegisterRequest(
  state: Pick<
    RegistrationState,
    "name" | "email" | "password" | "serviceType" | "companyInfo"
  >,
  passwordConfirmation: string
): RegisterRequest {
  const companyType =
    state.serviceType != null
      ? SERVICE_TYPE_TO_API[state.serviceType]
      : "rent_a_car";

  const companyPhone =
    state.companyInfo.countryCode && state.companyInfo.phoneNumber
      ? `${state.companyInfo.countryCode}${state.companyInfo.phoneNumber}`
      : undefined;

  return {
    name: state.name.trim() || state.companyInfo.name.trim(),
    email: state.email.trim(),
    password: state.password,
    password_confirmation: passwordConfirmation,
    company_name: state.companyInfo.name.trim(),
    company_type: companyType,
    phone: companyPhone,
    company_phone: companyPhone,
    company_email: state.companyInfo.businessEmail.trim() || undefined,
    company_address: state.companyInfo.addressLine.trim() || undefined,
    company_city: state.companyInfo.city.trim() || undefined,
    company_country: state.companyInfo.country.trim() || undefined,
  };
}
