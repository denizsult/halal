import { z } from "zod";

export const companyInfoSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  countryCode: z.string().min(1, "Country code is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9]+$/, "Please enter a valid phone number"),
  businessEmail: z
    .string()
    .min(1, "Business email is required")
    .email("Invalid email address"),
  addressLine: z.string().min(1, "Address line is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  licenseFile: z
    .custom<File | null>((val) => val instanceof File || val === null)
    .refine((file) => file !== null, {
      message: "Business license is required",
    }),
  logoFile: z
    .custom<File | null>((val) => val instanceof File || val === null)
    .optional(),
  coverFile: z
    .custom<File | null>((val) => val instanceof File || val === null)
    .optional(),
});

export type CompanyInfoFormData = z.infer<typeof companyInfoSchema>;
