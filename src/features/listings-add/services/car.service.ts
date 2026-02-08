"use client";

import { api } from "@/lib/axios";

import { carConfig } from "../config/car.config";
import type {
  CarAvailabilityDTO,
  CarFormData,
  CarPricingDTO,
  CarTermDTO,
  CreateCarDTO,
} from "../types";

const API_BASE = carConfig.apiEndpoints;

const resolveEndpoint = (url: string, id?: number): string => {
  if (id == null) return url;
  if (url.includes("{id}") || url.includes(":id")) {
    return url.replace("{id}", String(id)).replace(":id", String(id));
  }
  return `${url}/${id}`;
};

const extractId = (response: unknown): number | null => {
  if (!response || typeof response !== "object") return null;
  if (
    "data" in response &&
    typeof (response as { data?: unknown }).data === "number"
  ) {
    return (response as { data: number }).data;
  }
  if (
    "id" in response &&
    typeof (response as { id?: unknown }).id === "number"
  ) {
    return (response as { id: number }).id;
  }
  if (
    "data" in response &&
    typeof (response as { data?: { id?: number } }).data?.id === "number"
  ) {
    return (response as { data: { id: number } }).data.id;
  }
  return null;
};

const resolveNumber = (...values: unknown[]): number | null => {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return null;
};

const toDateOnly = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  // Support both "YYYY-MM-DD" and ISO datetime strings.
  const datePart = trimmed.split("T")[0];
  return /^\d{4}-\d{2}-\d{2}$/.test(datePart) ? datePart : null;
};

// Transform form data to API DTOs
function toCreateCarDTO(formData: Record<string, unknown>): CreateCarDTO {
  const location = formData.location_id as {
    latitude: number;
    longitude: number;
  } | null;

  return {
    car_model_id: formData.car_model_id as number,
    plate_number: formData.plate_number as string,
    country_id: formData.country_id as number,
    year: formData.year as number,
    mileage: formData.mileage as number,
    fuel_type: formData.fuel_type as number,
    transmission_type: formData.transmission_type as number,
    number_of_doors: formData.number_of_doors as number,
    number_of_seats: formData.number_of_seats as number,
    number_of_luggage: formData.number_of_luggage as number,
    is_professional_owner: formData.is_professional_owner as boolean,
    feature_ids: formData.feature_ids as number[],
    latitude: location?.latitude ?? 0,
    longitude: location?.longitude ?? 0,
    about: (formData.about as string) || "",
  };
}

function toPricingDTO(formData: Record<string, unknown>): CarPricingDTO {
  const pricing = formData.pricing as CarFormData["pricing"];
  return {
    low_price: pricing.low_price,
    medium_price: pricing.medium_price,
    high_price: pricing.high_price,
    early_booking_discount_percentage:
      pricing.early_booking_discount_percentage,
    offers: pricing.offers,
  };
}

function toAvailabilityDTO(
  formData: Record<string, unknown>
): CarAvailabilityDTO {
  const calendar = formData.calendar as CarFormData["calendar"];
  return {
    is_all_day: calendar.is_all_day,
    start_date: calendar.start_date || "",
    end_date: calendar.end_date || "",
    car_unavailable_reason: calendar.unavailable_reason || 0,
  };
}

function toTermsDTO(formData: Record<string, unknown>): CarTermDTO[] {
  const terms = formData.terms as CarFormData["terms"];
  return terms.map((term) => ({
    title: term.title,
    content: term.content,
  }));
}

export const carApiService = {
  // Create a new car listing
  async createCar(
    data: CreateCarDTO,
    appUserId?: string | number
  ): Promise<{ id: number }> {
    if (appUserId == null) {
      throw new Error("User ID is required to create a car listing");
    }

    const payload = {
      ...data,
      userId: appUserId,
    };

    const response = await api.post(API_BASE.create, payload);
    const id = extractId(response.data);
    if (!id) {
      throw new Error("Failed to create car");
    }
    return { id };
  },

  // Update an existing car listing
  async updateCar(
    carId: number,
    data: CreateCarDTO,
    appUserId?: string | number
  ): Promise<void> {
    const payload = {
      ...data,
      userId: appUserId,
    };

    await api.put(resolveEndpoint(API_BASE.update!, carId), payload);
  },

  // Get a car listing by ID
  async getListing(id: number): Promise<Record<string, unknown>> {
    const response = await api.get(resolveEndpoint(API_BASE.read!, id));
    const data = response.data.data;

    const carBrandId = resolveNumber(
      data.car_brand_id,
      data.brand_id,
      data.brand?.id,
      data.car_model?.brand?.id,
      data.car_model?.brand_id,
      data.model?.brand_id,
      data.model?.brand?.id
    );
    const carModelId = resolveNumber(
      data.car_model_id,
      data.model_id,
      data.model?.id,
      data.car_model?.id
    );
    const countryId = resolveNumber(
      data.country_id,
      data.country?.id,
      data.registration_country_id,
      data.registration_country?.id
    );
    const numberOfDoors = resolveNumber(data.number_of_doors, data.doors);
    const numberOfSeats = resolveNumber(data.number_of_seats, data.seats);
    const numberOfLuggage = resolveNumber(
      data.number_of_luggage,
      data.luggage_capacity
    );
    const pricingData = data.pricing ?? data;
    const calendarData = data.calendar ?? data;
    const featureIds = Array.isArray(data.feature_ids)
      ? data.feature_ids
      : data.features?.map((feature: { id: number }) => feature.id) || [];
    const existingImages = Array.isArray(data.images) ? data.images : [];

    // Transform API data back to form structure
    return {
      car_brand_id: carBrandId,
      car_model_id: carModelId,
      plate_number: data.plate_number,
      country_id: countryId,
      year: data.year ?? data.car_model_year,
      mileage: data.mileage,
      fuel_type: data.fuel_type ?? data.fuel_type_id,
      transmission_type: data.transmission_type ?? data.transmission_type_id,
      number_of_doors: numberOfDoors,
      number_of_seats: numberOfSeats,
      number_of_luggage: numberOfLuggage,
      is_professional_owner: data.is_professional_owner,
      feature_ids: featureIds,
      location_id:
        data.location?.latitude != null
          ? {
              place_id: data.location?.place_id ?? "",
              name: data.location?.name ?? "",
              formatted_address: data.location?.formatted_address ?? "",
              latitude: data.location.latitude,
              longitude: data.location.longitude,
            }
          : null,
      about: data.about,
      pricing: {
        low_price: pricingData.low_price,
        medium_price: pricingData.medium_price,
        high_price: pricingData.high_price,
        early_booking_discount_percentage:
          pricingData.early_booking_discount_percentage ??
          pricingData.early_booking_discount ??
          0,
        offers: pricingData.offers || [],
      },
      calendar: {
        is_all_day: calendarData.is_all_day ?? false,
        start_date:
          toDateOnly(calendarData.start_date) ??
          toDateOnly(calendarData.startDate) ??
          null,
        end_date:
          toDateOnly(calendarData.end_date) ??
          toDateOnly(calendarData.endDate) ??
          null,
        unavailable_reason:
          calendarData.car_unavailable_reason ??
          calendarData.unavailable_reason,
      },
      terms: data.terms || [],
      images: [],
      existingImages,
    };
  },

  // Upload car images – send as multipart/form-data with images[] (Laravel array convention).
  async uploadImages(carId: number, images: File[]): Promise<void> {
    const formData = new FormData();
    images.slice(0, 10).forEach((image, index) => {
      formData.append("images[]", image);
      if (index === 0) {
        formData.append("isMain", "true");
      }
    });

    await api.post(resolveEndpoint(API_BASE.uploadMedia!, carId), formData, {
      transformRequest: [
        (data, headers) => {
          if (data instanceof FormData && headers) {
            delete headers["Content-Type"];
          }
          return data;
        },
      ],
    });
  },

  // Update car pricing
  async updatePricing(carId: number, data: CarPricingDTO): Promise<void> {
    await api.put(resolveEndpoint(API_BASE.updatePricing!, carId), data);
  },

  // Update car availability
  async updateAvailability(
    carId: number,
    data: CarAvailabilityDTO
  ): Promise<void> {
    await api.post(resolveEndpoint(API_BASE.updateCalendar!, carId), data);
  },

  // Update car terms
  async updateTerms(carId: number, data: CarTermDTO[]): Promise<void> {
    await api.put(resolveEndpoint(API_BASE.updateTerms!, carId), data);
  },

  // Execute step action
  async executeStepAction(
    action: string,
    formData: Record<string, unknown>,
    entityId: number | null,
    appUserId?: string | number
  ): Promise<{ id?: number } | void> {
    switch (action) {
      case "create": {
        const createDTO = toCreateCarDTO(formData);
        if (entityId) {
          await this.updateCar(entityId, createDTO, appUserId);
          return { id: entityId };
        } else {
          const result = await this.createCar(createDTO, appUserId);
          return result;
        }
      }

      case "uploadMedia": {
        if (!entityId)
          throw new Error("Car ID is required for uploading images");
        const images = formData.images as File[];
        if (images && images.length > 0) {
          await this.uploadImages(entityId, images);
        }
        break;
      }

      case "updatePricing": {
        if (!entityId)
          throw new Error("Car ID is required for updating pricing");
        const pricingDTO = toPricingDTO(formData);
        await this.updatePricing(entityId, pricingDTO);
        break;
      }

      case "updateCalendar": {
        if (!entityId)
          throw new Error("Car ID is required for updating calendar");
        const availabilityDTO = toAvailabilityDTO(formData);
        await this.updateAvailability(entityId, availabilityDTO);
        break;
      }

      case "updateTerms": {
        if (!entityId) throw new Error("Car ID is required for updating terms");
        const termsDTO = toTermsDTO(formData);
        await this.updateTerms(entityId, termsDTO);
        break;
      }

      default:
        console.warn(`Unknown action: ${action}`);
    }
  },
};
