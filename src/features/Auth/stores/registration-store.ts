import { create } from "zustand";

import type { BankInfo, CompanyInfo, RegistrationStep } from "../types";

const initialCompanyInfo: CompanyInfo = {
  name: "",
  businessEmail: "",
  phoneNumber: "",
  countryCode: "+44",
  country: "",
  city: "",
  addressLine: "",
  zipCode: "",
  licenseFile: null,
  logoFile: null,
  coverFile: null,
};

interface RegistrationState {
  step: RegistrationStep;
  name: string;
  email: string;
  otp: string;
  serviceType: number | null;
  companyInfo: CompanyInfo;
  bankInfo: BankInfo;
  password: string;
}

interface RegistrationActions {
  setStep: (step: RegistrationStep) => void;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setOtp: (otp: string) => void;
  setServiceType: (type: number) => void;
  setCompanyInfo: (info: Partial<CompanyInfo>) => void;
  setBankInfo: (info: Partial<BankInfo>) => void;
  setPassword: (password: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

const STEPS: RegistrationStep[] = [
  "email",
  "otp",
  "service",
  "company",
  "bank",
  "password",
];

export const useRegistrationStore = create<
  RegistrationState & RegistrationActions
>((set, get) => ({
  // Initial state
  step: "email",
  name: "",
  email: "",
  otp: "",
  serviceType: null,
  companyInfo: { ...initialCompanyInfo },
  bankInfo: {
    bankName: "",
    branchName: "",
    branchCode: "",
    accountHolder: "",
    accountNumber: "",
    IBAN: "",
    swiftCode: "",
    currency: "",
  },
  password: "",

  setStep: (step) => set({ step }),

  setName: (name) => set({ name }),

  setEmail: (email) => set({ email }),

  setOtp: (otp) => set({ otp }),

  setServiceType: (type) => set({ serviceType: type }),

  setCompanyInfo: (info) =>
    set((state) => ({
      companyInfo: { ...state.companyInfo, ...info },
    })),

  setBankInfo: (info) =>
    set((state) => ({
      bankInfo: { ...state.bankInfo, ...info },
    })),

  setPassword: (password) => set({ password }),

  nextStep: () => {
    const currentIndex = STEPS.indexOf(get().step);
    if (currentIndex < STEPS.length - 1) {
      set({ step: STEPS[currentIndex + 1] });
    }
  },

  prevStep: () => {
    const currentIndex = STEPS.indexOf(get().step);
    if (currentIndex > 0) {
      set({ step: STEPS[currentIndex - 1] });
    }
  },

  reset: () =>
    set({
      step: "email",
      name: "",
      email: "",
      otp: "",
      serviceType: null,
      companyInfo: { ...initialCompanyInfo },
      bankInfo: {
        bankName: "",
        branchName: "",
        branchCode: "",
        accountHolder: "",
        accountNumber: "",
        IBAN: "",
        swiftCode: "",
        currency: "",
      },
      password: "",
    }),
}));

// Selectors
export const selectStep = (state: RegistrationState & RegistrationActions) =>
  state.step;
export const selectEmail = (state: RegistrationState & RegistrationActions) =>
  state.email;
export const selectCompanyInfo = (
  state: RegistrationState & RegistrationActions
) => state.companyInfo;
export const selectBankInfo = (
  state: RegistrationState & RegistrationActions
) => state.bankInfo;
