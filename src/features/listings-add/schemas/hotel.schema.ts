import { z } from "zod";

// Step 1: Property Details Schema
export const hotelDetailsSchema = z.object({
  propertyName: z.string().min(1, "Property name is required"),
  propertyType: z.number().min(1, "Property type is required"),
  starRating: z.number().min(0, "Star rating is required"),
  locationId: z.number().min(1, "Location is required"),
  address: z.string().min(1, "Address is required"),
  city_id: z.number().min(1, "City is required"),
  country_id: z.number().min(1, "Country is required"),
  zipCode: z.string().optional(),
  totalFloors: z.number().optional(),
  description: z.string().min(1, "Description is required"),
  amenityIds: z.array(z.number()).optional(),
  languagesSpoken: z.array(z.number()).optional(),
});

// Step 2: Rooms Schema
export const hotelRoomsSchema = z.object({
  rooms: z
    .array(
      z.object({
        roomType: z.string().min(1, "Room type is required"),
        bedType: z.number().min(1, "Bed type is required"),
        maxGuests: z.number().min(1, "Max guests is required"),
        roomSize: z.number().optional(),
        quantity: z.number().min(1, "Quantity is required"),
        amenities: z.array(z.number()).optional(),
      })
    )
    .min(1, "At least one room type is required"),
});

// Step 3: Media Schema
export const hotelMediaSchema = z.object({
  propertyImages: z
    .array(z.instanceof(File))
    .min(1, "At least one property image is required"),
  roomImages: z
    .array(z.instanceof(File))
    .min(1, "At least one room image is required"),
});

// Step 4: Pricing Schema
export const hotelPricingSchema = z.object({
  pricing: z.object({
    basePrice: z.number().min(1, "Base price is required"),
    weekendMultiplier: z.number().optional(),
    seasonalPricing: z
      .array(
        z.object({
          seasonName: z.string(),
          startDate: z.string(),
          endDate: z.string(),
          multiplier: z.number(),
        })
      )
      .optional(),
  }),
});

// Step 5: Availability Schema
export const hotelAvailabilitySchema = z.object({
  calendar: z
    .object({
      blockedDates: z.array(z.string()).optional(),
    })
    .optional(),
  minimumStay: z.number().min(1, "Minimum stay is required"),
  maximumStay: z.number().optional(),
});

// Step 6: Policies Schema
export const hotelPoliciesSchema = z.object({
  checkInTime: z.string().min(1, "Check-in time is required"),
  checkOutTime: z.string().min(1, "Check-out time is required"),
  cancellationPolicy: z.number().min(1, "Cancellation policy is required"),
  petsAllowed: z.boolean(),
  smokingAllowed: z.boolean(),
  childrenAllowed: z.boolean(),
  partiesAllowed: z.boolean(),
  houseRules: z.string().optional(),
  paymentMethods: z
    .array(z.number())
    .min(1, "At least one payment method is required"),
});

// Step 7: Contact Schema
export const hotelContactSchema = z.object({
  contactName: z.string().min(1, "Contact name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Valid email is required"),
  website: z.string().optional(),
  emergencyContact: z.string().min(1, "Emergency contact is required"),
});

// Schema array indexed by step
export const hotelSchemas = [
  hotelDetailsSchema,
  hotelRoomsSchema,
  hotelMediaSchema,
  hotelPricingSchema,
  hotelAvailabilitySchema,
  hotelPoliciesSchema,
  hotelContactSchema,
];

// Types inferred from schemas
export type HotelDetailsFormData = z.infer<typeof hotelDetailsSchema>;
export type HotelRoomsFormData = z.infer<typeof hotelRoomsSchema>;
export type HotelMediaFormData = z.infer<typeof hotelMediaSchema>;
export type HotelPricingFormData = z.infer<typeof hotelPricingSchema>;
export type HotelAvailabilityFormData = z.infer<typeof hotelAvailabilitySchema>;
export type HotelPoliciesFormData = z.infer<typeof hotelPoliciesSchema>;
export type HotelContactFormData = z.infer<typeof hotelContactSchema>;
