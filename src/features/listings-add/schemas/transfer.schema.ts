import { z } from "zod";

// Step 1: Vehicle Details Schema
export const transferVehicleSchema = z.object({
  vehicle_brand_id: z.number().min(1, "Brand is required"),
  car_model_id: z.number().min(1, "Model is required"),
  plate_number: z
    .string()
    .min(1, "Plate number is required")
    .max(20, "Plate number is too long"),
  country_id: z.number().min(1, "Country is required"),
  car_model_year: z
    .number()
    .min(1990, "Model year must be 1990 or later")
    .max(new Date().getFullYear() + 1, "Invalid year"),
  mileage: z.number().min(0, "Mileage must be positive"),
  fuel_type: z.number().min(1, "Fuel type is required"),
  transmission_type: z.number().min(1, "Transmission type is required"),
  number_of_doors: z.number().min(1, "Number of doors is required"),
  number_of_seats: z.number().min(1, "Number of seats is required"),
  number_of_luggage: z.number().min(0, "Number of luggage must be positive"),
  feature_ids: z.array(z.number()).optional(),
  is_professional_owner: z.boolean(),
});

// Step 2: Service Information Schema
export const transferServiceSchema = z.object({
  service_name: z.string().min(1, "Service name is required"),
  service_type: z
    .array(z.number())
    .min(1, "At least one service type is required"),
  pickup_locations: z
    .array(
      z.object({
        lat: z.number(),
        lng: z.number(),
        name: z.string(),
      })
    )
    .min(1, "At least one pickup location is required"),
  dropoff_locations: z
    .array(
      z.object({
        lat: z.number(),
        lng: z.number(),
        name: z.string(),
      })
    )
    .min(1, "At least one drop-off location is required"),
  service_area: z.number().min(1, "Service area is required"),
  max_travel_distance: z.number().optional(),
  operating_hours: z.number().min(1, "Operating hours selection is required"),
  custom_hours: z
    .object({
      monday: z.object({ start: z.string(), end: z.string() }).optional(),
      tuesday: z.object({ start: z.string(), end: z.string() }).optional(),
      wednesday: z.object({ start: z.string(), end: z.string() }).optional(),
      thursday: z.object({ start: z.string(), end: z.string() }).optional(),
      friday: z.object({ start: z.string(), end: z.string() }).optional(),
      saturday: z.object({ start: z.string(), end: z.string() }).optional(),
      sunday: z.object({ start: z.string(), end: z.string() }).optional(),
    })
    .optional(),
  advance_booking_required: z
    .number()
    .min(1, "Advance booking hours is required"),
  instant_booking: z.boolean(),
});

// Step 3: Driver Information Schema
export const transferDriverSchema = z.object({
  driver_name: z.string().min(1, "Driver name is required"),
  driver_phone: z.string().min(1, "Driver phone is required"),
  license_number: z.string().min(1, "License number is required"),
  years_of_experience: z.number().min(0, "Years of experience is required"),
  languages_spoken: z
    .array(z.number())
    .min(1, "At least one language is required"),
  driver_features: z.array(z.number()).optional(),
  driver_bio: z.string().optional(),
});

// Step 4: Pricing Schema
export const transferPricingSchema = z.object({
  pricing_type: z.number().min(1, "Pricing model is required"),
  pricing: z
    .object({
      base_price: z.number().optional(),
      price_per_km: z.number().optional(),
      price_per_hour: z.number().optional(),
      routes: z
        .array(
          z.object({
            from: z.string(),
            to: z.string(),
            price: z.number(),
          })
        )
        .optional(),
    })
    .optional(),
  waiting_time_charge: z.number().optional(),
  meet_and_greet_fee: z.number().optional(),
  extra_luggage_fee: z.number().optional(),
  child_seat_fee: z.number().optional(),
  cancellation_policy: z.number().min(1, "Cancellation policy is required"),
});

// Step 5: Media Schema
export const transferMediaSchema = z.object({
  vehicle_images: z
    .array(z.instanceof(File))
    .min(1, "At least one vehicle photo is required"),
  driver_photo: z.array(z.instanceof(File)).optional(),
});

// Step 6: Extras Schema
export const transferExtrasSchema = z.object({
  extra_services: z.array(z.number()).optional(),
  special_requests: z.boolean(),
  special_requests_note: z.string().optional(),
});

// Step 7: Terms Schema
export const transferTermsSchema = z.object({
  minimum_age: z.number().optional(),
  payment_method: z
    .array(z.number())
    .min(1, "At least one payment method is required"),
  payment_timing: z.number().min(1, "Payment timing is required"),
  smoking_allowed: z.boolean(),
  pets_allowed: z.boolean(),
  luggage_policy: z.string().optional(),
  additional_terms: z.string().optional(),
});

// Schema array indexed by step
export const transferSchemas = [
  transferVehicleSchema,
  transferServiceSchema,
  transferDriverSchema,
  transferPricingSchema,
  transferMediaSchema,
  transferExtrasSchema,
  transferTermsSchema,
];

// Types inferred from schemas
export type TransferVehicleFormData = z.infer<typeof transferVehicleSchema>;
export type TransferServiceFormData = z.infer<typeof transferServiceSchema>;
export type TransferDriverFormData = z.infer<typeof transferDriverSchema>;
export type TransferPricingFormData = z.infer<typeof transferPricingSchema>;
export type TransferMediaFormData = z.infer<typeof transferMediaSchema>;
export type TransferExtrasFormData = z.infer<typeof transferExtrasSchema>;
export type TransferTermsFormData = z.infer<typeof transferTermsSchema>;
