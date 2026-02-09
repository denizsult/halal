import { z } from "zod";

// Step 1: Basic Information Schema
export const hospitalBasicInfoSchema = z.object({
  name: z
    .string()
    .min(1, "Hospital name is required")
    .max(200, "Hospital name is too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description is too long"),
});

// Step 2: Mission & Vision Schema
export const hospitalMissionVisionSchema = z.object({
  mission: z
    .string()
    .min(10, "Mission statement must be at least 10 characters")
    .max(1000, "Mission statement is too long"),
  vision: z
    .string()
    .min(10, "Vision statement must be at least 10 characters")
    .max(1000, "Vision statement is too long"),
});

// Step 3: Media Schema
export const hospitalMediaSchema = z.object({
  logo: z.instanceof(File).nullable().optional(),
  cover: z.instanceof(File).nullable().optional(),
});

// Step 4: Contact Information Schema
export const hospitalContactSchema = z.object({
  address: z.string().optional(),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\+\-\(\)]+$/.test(val),
      "Please enter a valid phone number"
    ),
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "Please enter a valid email address"
    ),
});

// Combined schema for full validation
export const hospitalFullSchema = z.object({
  ...hospitalBasicInfoSchema.shape,
  ...hospitalMissionVisionSchema.shape,
  ...hospitalMediaSchema.shape,
  ...hospitalContactSchema.shape,
});

// Schema array indexed by step
export const hospitalSchemas = [
  hospitalBasicInfoSchema,
  hospitalMissionVisionSchema,
  hospitalMediaSchema,
  hospitalContactSchema,
];

// Types inferred from schemas
export type HospitalBasicInfoFormData = z.infer<typeof hospitalBasicInfoSchema>;
export type HospitalMissionVisionFormData = z.infer<
  typeof hospitalMissionVisionSchema
>;
export type HospitalMediaFormData = z.infer<typeof hospitalMediaSchema>;
export type HospitalContactFormData = z.infer<typeof hospitalContactSchema>;
export type HospitalFullFormData = z.infer<typeof hospitalFullSchema>;
