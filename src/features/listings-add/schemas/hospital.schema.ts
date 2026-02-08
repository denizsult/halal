import { z } from "zod";

// Shared schemas for Hospital Details (Step 1)
export const hospitalLocationsSchema = z.object({
  locations: z.object({
    headquartersName: z
      .string()
      .min(1, "Headquarter name is required")
      .max(200, "Headquarter name is too long"),
    headquartersAddress: z
      .string()
      .min(1, "Headquarter address is required")
      .max(300, "Headquarter address is too long"),
    branches: z
      .array(
        z.object({
          name: z.string().min(1, "Branch name is required"),
          address: z.string().min(1, "Branch address is required"),
          isTemporarilyClosed: z.boolean().optional(),
        })
      )
      .optional()
      .default([]),
  }),
});

export const hospitalMissionVisionSchema = z.object({
  missionVision: z.object({
    mission: z
      .string()
      .min(10, "Mission statement must be at least 10 characters")
      .max(200, "Mission statement is too long"),
    vision: z
      .string()
      .min(10, "Vision statement must be at least 10 characters")
      .max(3000, "Vision statement is too long"),
  }),
});

const hospitalStatisticItemSchema = z
  .object({
    title: z.string().optional(),
    value: z.string().optional(),
  })
  .refine(
    (item) =>
      (!item.title && !item.value) ||
      (item.title?.trim() && item.value?.trim()),
    {
      message: "Title and data are required",
      path: ["title"],
    }
  );

export const hospitalStatisticsSchema = z.object({
  statistics: z.object({
    statistics: z.array(hospitalStatisticItemSchema).optional().default([]),
  }),
});

const hospitalCertificateItemSchema = z
  .object({
    title: z.string().optional(),
    file: z.instanceof(File).nullable().optional(),
  })
  .refine((item) => !item.file || item.title?.trim(), {
    message: "Title is required",
    path: ["title"],
  });

export const hospitalCertificatesSchema = z.object({
  certificates: z.object({
    certificates: z.array(hospitalCertificateItemSchema).optional().default([]),
  }),
});

const hospitalAwardItemSchema = z
  .object({
    title: z.string().optional(),
    file: z.instanceof(File).nullable().optional(),
  })
  .refine((item) => !item.file || item.title?.trim(), {
    message: "Title is required",
    path: ["title"],
  });

export const hospitalAwardsSchema = z.object({
  awards: z.object({
    awards: z.array(hospitalAwardItemSchema).optional().default([]),
  }),
});

// Step 4: Media Schema
export const hospitalMediaSchema = z.object({
  media: z.object({
    photos: z
      .array(z.instanceof(File))
      .min(5, "Upload at least 5 photos")
      .optional()
      .default([]),
  }),
});

// Step 1: Hospital Details Schema (combined)
export const hospitalDetailsSchema = z.object({
  ...hospitalLocationsSchema.shape,
  ...hospitalMissionVisionSchema.shape,
  ...hospitalStatisticsSchema.shape,
  ...hospitalCertificatesSchema.shape,
  ...hospitalAwardsSchema.shape,
});

// Step 2: Doctors Schema (placeholder)
const doctorStatisticSchema = z
  .object({
    title: z.string().optional(),
    value: z.string().optional(),
  })
  .refine(
    (item) =>
      (!item.title && !item.value) ||
      (item.title?.trim() && item.value?.trim()),
    {
      message: "Title and data are required",
      path: ["title"],
    }
  );

const doctorEntrySchema = z.object({
  title: z.string().min(1, "Address is required"),
  fullName: z.string().min(1, "Full name is required"),
  rating: z.string().min(1, "Rating is required"),
  about: z.string().min(1, "About doctor is required"),
  expertise: z.array(z.string()).min(1, "Select at least one expertise"),
  statistics: z.array(doctorStatisticSchema).optional().default([]),
  photo: z.instanceof(File, { message: "Doctor photo is required" }),
  license: z.instanceof(File, { message: "Doctor license is required" }),
  certificates: z.array(z.instanceof(File)).optional().default([]),
});

export const hospitalDoctorsSchema = z.object({
  doctors: z.object({
    doctors: z.array(doctorEntrySchema).min(1, "Add at least one doctor"),
  }),
});

// Step 3: Services Schema (placeholder)
const serviceStatisticSchema = z
  .object({
    title: z.string().optional(),
    value: z.string().optional(),
  })
  .refine(
    (item) =>
      (!item.title && !item.value) ||
      (item.title?.trim() && item.value?.trim()),
    {
      message: "Title and data are required",
      path: ["title"],
    }
  );

const serviceEntrySchema = z.object({
  title: z.string().min(1, "Title is required"),
  about: z.string().min(1, "About service is required"),
  symptoms: z.array(z.string()).min(1, "Select at least one symptom"),
  doctors: z.array(z.string()).min(1, "Select at least one doctor"),
  statistics: z.array(serviceStatisticSchema).optional().default([]),
  photo: z.instanceof(File, { message: "Service photo is required" }),
  cover: z.instanceof(File, { message: "Cover photo is required" }),
});

export const hospitalServicesSchema = z.object({
  services: z.object({
    services: z.array(serviceEntrySchema).min(1, "Add at least one service"),
  }),
});

// Combined schema for full validation
export const hospitalFullSchema = z.object({
  ...hospitalDetailsSchema.shape,
  ...hospitalMediaSchema.shape,
});

// Schema array indexed by step
export const hospitalSchemas = [
  hospitalDetailsSchema,
  hospitalDoctorsSchema,
  hospitalServicesSchema,
  hospitalMediaSchema,
];

// Types inferred from schemas
export type HospitalLocationsFormData = z.infer<typeof hospitalLocationsSchema>;
export type HospitalMissionVisionFormData = z.infer<
  typeof hospitalMissionVisionSchema
>;
export type HospitalStatisticsFormData = z.infer<
  typeof hospitalStatisticsSchema
>;
export type HospitalCertificatesFormData = z.infer<
  typeof hospitalCertificatesSchema
>;
export type HospitalAwardsFormData = z.infer<typeof hospitalAwardsSchema>;
export type HospitalDetailsFormData = z.infer<typeof hospitalDetailsSchema>;
export type HospitalMediaFormData = z.infer<typeof hospitalMediaSchema>;
export type HospitalFullFormData = z.infer<typeof hospitalFullSchema>;
