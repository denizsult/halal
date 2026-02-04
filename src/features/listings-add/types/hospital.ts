import type { BaseFormData } from "./base";

// Complete hospital form data
export interface HospitalFormData extends BaseFormData {
  // Step 1: Basic Information
  name: string;
  description: string;

  // Step 2: Mission & Vision
  mission: string;
  vision: string;

  // Step 3: Media
  logo: File | null;
  cover: File | null;

  // Step 4: Contact Information
  address: string;
  phone: string;
  email: string;
}

// Initial hospital form data
export const initialHospitalFormData: HospitalFormData = {
  name: "",
  description: "",
  mission: "",
  vision: "",
  logo: null,
  cover: null,
  address: "",
  phone: "",
  email: "",
};

// API DTOs
export interface CreateHospitalDTO {
  name: string;
  description: string;
  mission: string;
  vision: string;
}

export interface UpdateHospitalDTO {
  id: number;
  name?: string;
  description?: string;
  mission?: string;
  vision?: string;
}

export interface HospitalMediaDTO {
  id: number;
  logo?: File;
  cover?: File;
}
