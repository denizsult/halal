import { z } from "zod";

// Step 1: Car Details Schema
export const carDetailsSchema = z.object({
  car_brand_id: z.number().min(1, "Brand is required"),
  car_model_id: z.number().min(1, "Model is required"),
  plate_number: z
    .string()
    .min(1, "Plate number is required")
    .max(20, "Plate number is too long"),
  country_id: z.number().min(1, "Country is required"),
  year: z
    .number()
    .min(1990, "Year must be 1990 or later")
    .max(new Date().getFullYear() + 1, "Invalid year"),
  mileage: z.number().min(0, "Mileage must be positive"),
  fuel_type: z.number().min(1, "Fuel type is required"),
  transmission_type: z.number().min(1, "Transmission type is required"),
  number_of_doors: z.number().min(1, "Number of doors is required"),
  number_of_seats: z.number().min(1, "Number of seats is required"),
  number_of_luggage: z.number().min(0, "Number of luggage must be positive"),
  about: z.string().optional(),
  feature_ids: z.array(z.number()).optional(),
  is_professional_owner: z.boolean(),
  location_id: z.number().min(1, "Check-in location is required"),
});

// Step 2: Pricing Schema
export const carPricingSchema = z.object({
  pricing: z
    .object({
      low_price: z.number().min(1, "Low price must be greater than 0"),
      medium_price: z.number().min(1, "Medium price must be greater than 0"),
      high_price: z.number().min(1, "High price must be greater than 0"),
      early_booking_discount_percentage: z
        .number()
        .min(0, "Discount cannot be negative")
        .max(100, "Discount cannot exceed 100%")
        .default(0),
      offers: z
        .array(
          z.object({
            discount_price: z
              .number()
              .min(0, "Discount price must be positive"),
            start_date: z.string().min(1, "Start date is required"),
            end_date: z.string().min(1, "End date is required"),
          })
        )
        .default([]),
    })
    .refine(
      (data) =>
        data.low_price <= data.medium_price &&
        data.medium_price <= data.high_price,
      {
        message: "Prices must be in order: Low <= Medium <= High",
        path: ["low_price"],
      }
    ),
});

// Step 3: Media Schema (backend allows max 10 images at once)
export const carMediaSchema = z.object({
  images: z
    .array(z.instanceof(File))
    .min(1, "At least one image is required")
    .max(10, "Maximum 10 images can be uploaded at once"),
});

// Step 4: Calendar Schema
export const carCalendarSchema = z.object({
  calendar: z
    .object({
      start_date: z.string().min(1, "Start date is required"),
      end_date: z.string().min(1, "End date is required"),
      is_all_day: z.boolean().default(false),
      unavailable_reason: z.number().nullable().default(null),
    })
    .refine(
      (data) => {
        if (!data.start_date || !data.end_date) return true;
        return new Date(data.start_date) < new Date(data.end_date);
      },
      {
        message: "End date must be after start date",
        path: ["end_date"],
      }
    ),
});

// Step 5: Terms Schema
export const carTermsSchema = z.object({
  terms: z
    .array(
      z.object({
        title: z.string().min(1, "Term title is required"),
        content: z
          .array(z.string())
          .min(1, "At least one term content is required"),
      })
    )
    .min(1, "At least one term is required"),
});

// Combined schema for full validation
export const carFullSchema = z.object({
  ...carDetailsSchema.shape,
  ...carPricingSchema.shape,
  ...carMediaSchema.shape,
  ...carCalendarSchema.shape,
  ...carTermsSchema.shape,
});

// Schema array indexed by step
export const carSchemas = [
  carDetailsSchema,
  carPricingSchema,
  carMediaSchema,
  carCalendarSchema,
  carTermsSchema,
];

// Types inferred from schemas
export type CarDetailsFormData = z.infer<typeof carDetailsSchema>;
export type CarPricingFormData = z.infer<typeof carPricingSchema>;
export type CarMediaFormData = z.infer<typeof carMediaSchema>;
export type CarCalendarFormData = z.infer<typeof carCalendarSchema>;
export type CarTermsFormData = z.infer<typeof carTermsSchema>;
export type CarFullFormData = z.infer<typeof carFullSchema>;
