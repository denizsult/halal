import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(1, "Company name is required").max(255),
  phone: z.string().max(20).optional().or(z.literal("")),
  email: z
    .string()
    .email("Please enter a valid email")
    .optional()
    .or(z.literal("")),
  address: z.string().max(500).optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  tax_number: z.string().max(50).optional().or(z.literal("")),
  about: z.string().max(2000).optional().or(z.literal("")),
});

export type CompanyFormData = z.infer<typeof companySchema>;
