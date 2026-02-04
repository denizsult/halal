"use client";

import { api } from "@/lib/axios";

import { hotelConfig } from "../config/hotel.config";

import type { ListingApiService } from "./index";

const API_BASE = hotelConfig.apiEndpoints;

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

async function createHotel(
  formData: Record<string, unknown>
): Promise<{ id: number }> {
  const response = await api.post(API_BASE.create, formData);
  const id = extractId(response.data);
  if (!id) {
    throw new Error("Failed to create hotel");
  }
  return { id };
}

async function updateHotel(
  hotelId: number,
  formData: Record<string, unknown>
): Promise<void> {
  await api.put(resolveEndpoint(API_BASE.update, hotelId), formData);
}

async function uploadHotelImages(
  hotelId: number,
  formData: Record<string, unknown>
): Promise<void> {
  const propertyImages = formData.propertyImages as File[] | undefined;
  const roomImages = formData.roomImages as File[] | undefined;

  const uploadPromises: Promise<void>[] = [];

  if (propertyImages && propertyImages.length > 0) {
    const formDataObj = new FormData();
    propertyImages.forEach((file, index) => {
      formDataObj.append("images", file);
      if (index === 0) formDataObj.append("isMain", "true");
    });
    formDataObj.append("type", "property");

    uploadPromises.push(
      api
        .post(resolveEndpoint(API_BASE.uploadMedia!, hotelId), formDataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(() => undefined)
    );
  }

  if (roomImages && roomImages.length > 0) {
    const formDataObj = new FormData();
    roomImages.forEach((file) => {
      formDataObj.append("images", file);
    });
    formDataObj.append("type", "room");

    uploadPromises.push(
      api
        .post(resolveEndpoint(API_BASE.uploadMedia!, hotelId), formDataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(() => undefined)
    );
  }

  await Promise.all(uploadPromises);
}

async function updateHotelRooms(
  hotelId: number,
  formData: Record<string, unknown>
): Promise<void> {
  await api.put(resolveEndpoint(API_BASE.updateRooms!, hotelId), {
    rooms: formData.rooms,
  });
}

async function updateHotelPricing(
  hotelId: number,
  formData: Record<string, unknown>
): Promise<void> {
  await api.put(resolveEndpoint(API_BASE.updatePricing!, hotelId), {
    pricing: formData.pricing,
  });
}

export const hotelApiService: ListingApiService = {
  getListing: async (id: number): Promise<Record<string, unknown>> => {
    const response = await api.get(resolveEndpoint(API_BASE.read!, id));
    const data = response.data.data;

    const countryId = resolveNumber(
      data.country_id,
      data.country?.id,
      data.property_country_id,
      data.property_country?.id
    );
    const cityId = resolveNumber(
      data.city_id,
      data.city?.id,
      data.property_city_id,
      data.property_city?.id
    );

    return {
      ...data,
      propertyName: data.propertyName ?? data.property_name,
      propertyType: data.propertyType ?? data.property_type,
      starRating: data.starRating ?? data.star_rating,
      locationId: data.locationId ?? data.location_id,
      zipCode: data.zipCode ?? data.zip_code,
      totalFloors: data.totalFloors ?? data.total_floors,
      amenityIds:
        data.amenityIds ??
        data.amenity_ids ??
        data.amenities?.map((amenity: { id: number }) => amenity.id),
      languagesSpoken:
        data.languagesSpoken ??
        data.languages_spoken ??
        data.languages?.map((language: { id: number }) => language.id),
      country_id: countryId ?? data.country_id,
      city_id: cityId ?? data.city_id,
    };
  },
  executeStepAction: async (
    action: string,
    formData: Record<string, unknown>,
    entityId: number | null,
    _appUserId?: string | number
  ): Promise<{ id?: number } | void> => {
    switch (action) {
      case "create":
        return await createHotel(formData);

      case "update":
        if (!entityId) throw new Error("Hotel ID is required for update");
        await updateHotel(entityId, formData);
        return;

      case "uploadMedia":
        if (!entityId) throw new Error("Hotel ID is required for media upload");
        await uploadHotelImages(entityId, formData);
        return;

      case "updateRooms":
        if (!entityId) throw new Error("Hotel ID is required for rooms update");
        await updateHotelRooms(entityId, formData);
        return;

      case "updatePricing":
        if (!entityId)
          throw new Error("Hotel ID is required for pricing update");
        await updateHotelPricing(entityId, formData);
        return;

      default:
        console.warn(`Unknown action: ${action}`);
    }
  },
};
