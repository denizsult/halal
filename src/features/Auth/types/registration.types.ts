import type { CompanyType } from "@/types/api";

export type ServiceType =
  | "hotel"
  | "hospitals"
  | "car-rental"
  | "transfers"
  | "tours"
  | "events"
  | "activities"
  | "rooms"
  | "medical-resorts";

/** Maps UI service type to numeric value (for forms/display). */
export const SERVICE_TYPE_MAP: Record<ServiceType, number> = {
  hotel: 1,
  transfers: 2,
  "car-rental": 3,
  tours: 4,
  events: 5,
  activities: 6,
  rooms: 7,
  hospitals: 8,
  "medical-resorts": 9,
};

/** Maps numeric service type to API company_type (OpenAPI RegisterRequest). */
export const SERVICE_TYPE_TO_API: Record<number, CompanyType> = {
  1: "hotel",
  2: "transfer",
  3: "rent_a_car",
  4: "tour",
  5: "event",
  6: "activity",
  7: "room",
  8: "hospital",
  9: "health",
};

export interface CompanyInfo {
  name: string;
  businessEmail: string;
  phoneNumber: string;
  countryCode: string;
  country: string;
  city: string;
  addressLine: string;
  zipCode: string;
  licenseFile: File | null;
  logoFile: File | null;
  coverFile: File | null;
}

export interface BankInfo {
  bankName: string;
  branchName: string;
  branchCode: string;
  accountHolder: string;
  accountNumber: string;
  IBAN: string;
  swiftCode: string;
  currency: string;
}

export type RegistrationStep =
  | "email"
  | "otp"
  | "service"
  | "company"
  | "bank"
  | "password";

export interface RegistrationState {
  step: RegistrationStep;
  /** Contact / user full name (for RegisterRequest.name) */
  name: string;
  email: string;
  otp: string;
  serviceType: number | null;
  companyInfo: CompanyInfo;
  bankInfo: BankInfo;
  password: string;
}
