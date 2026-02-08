"use client";

import { api } from "@/lib/axios";

import { transferConfig } from "../config/transfer.config";

import type { ListingApiService } from "./index";

const API_BASE = transferConfig.apiEndpoints;

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

async function createTransfer(
  formData: Record<string, unknown>
): Promise<{ id: number }> {
  const response = await api.post(API_BASE.create, formData);
  const id = extractId(response.data);
  if (!id) {
    throw new Error("Failed to create transfer");
  }
  return { id };
}

async function updateTransfer(
  transferId: number,
  formData: Record<string, unknown>
): Promise<void> {
  await api.put(resolveEndpoint(API_BASE.update, transferId), formData);
}

async function updateTransferService(
  transferId: number,
  formData: Record<string, unknown>
): Promise<void> {
  await api.put(resolveEndpoint(API_BASE.updateService!, transferId), formData);
}

async function updateTransferDriver(
  transferId: number,
  formData: Record<string, unknown>
): Promise<void> {
  await api.put(resolveEndpoint(API_BASE.updateDriver!, transferId), formData);
}

async function updateTransferPricing(
  transferId: number,
  formData: Record<string, unknown>
): Promise<void> {
  await api.put(resolveEndpoint(API_BASE.updatePricing!, transferId), formData);
}

async function uploadTransferMedia(
  transferId: number,
  formData: Record<string, unknown>
): Promise<void> {
  const vehicleImages = formData.vehicle_images as File[] | undefined;
  const driverPhoto = formData.driver_photo as File[] | undefined;

  const uploadPromises: Promise<void>[] = [];

  if (vehicleImages && vehicleImages.length > 0) {
    const formDataObj = new FormData();
    vehicleImages.forEach((file, index) => {
      formDataObj.append("images", file);
      if (index === 0) formDataObj.append("isMain", "true");
    });
    formDataObj.append("type", "vehicle");

    uploadPromises.push(
      api
        .post(resolveEndpoint(API_BASE.uploadMedia!, transferId), formDataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(() => undefined)
    );
  }

  if (driverPhoto && driverPhoto.length > 0) {
    const formDataObj = new FormData();
    driverPhoto.forEach((file) => {
      formDataObj.append("images", file);
    });
    formDataObj.append("type", "driver");

    uploadPromises.push(
      api
        .post(resolveEndpoint(API_BASE.uploadMedia!, transferId), formDataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(() => undefined)
    );
  }

  await Promise.all(uploadPromises);
}

async function updateTransferInformations(
  transferId: number,
  formData: Record<string, unknown>
): Promise<void> {
  await api.put(
    resolveEndpoint(API_BASE.updateInformations!, transferId),
    formData
  );
}

async function updateTransferExtras(
  transferId: number,
  formData: Record<string, unknown>
): Promise<void> {
  await api.put(resolveEndpoint(API_BASE.updateExtras!, transferId), formData);
}

async function updateTransferTerms(
  transferId: number,
  formData: Record<string, unknown>
): Promise<void> {
  await api.put(resolveEndpoint(API_BASE.updateTerms!, transferId), formData);
}

export const transferApiService: ListingApiService = {
  getListing: async (id: number): Promise<Record<string, unknown>> => {
    const response = await api.get(resolveEndpoint(API_BASE.read!, id));
    const data = response.data.data;

    const vehicleBrandId = resolveNumber(
      data.vehicle_brand_id,
      data.brand_id,
      data.brand?.id,
      data.vehicle_brand?.id,
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
    const countryId = resolveNumber(data.country_id, data.country?.id);
    const numberOfDoors = resolveNumber(data.number_of_doors, data.doors);
    const numberOfSeats = resolveNumber(data.number_of_seats, data.seats);
    const numberOfLuggage = resolveNumber(
      data.number_of_luggage,
      data.luggage_capacity
    );

    return {
      ...data,
      vehicle_brand_id: vehicleBrandId ?? data.vehicle_brand_id,
      car_model_id: carModelId ?? data.car_model_id,
      country_id: countryId ?? data.country_id,
      number_of_doors: numberOfDoors ?? data.number_of_doors,
      number_of_seats: numberOfSeats ?? data.number_of_seats,
      number_of_luggage: numberOfLuggage ?? data.number_of_luggage,
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
        return await createTransfer(formData);

      case "update":
        if (!entityId) throw new Error("Transfer ID is required for update");
        await updateTransfer(entityId, formData);
        return;

      case "updateService":
        if (!entityId)
          throw new Error("Transfer ID is required for service update");
        await updateTransferService(entityId, formData);
        return;

      case "updateDriver":
        if (!entityId)
          throw new Error("Transfer ID is required for driver update");
        await updateTransferDriver(entityId, formData);
        return;

      case "updatePricing":
        if (!entityId)
          throw new Error("Transfer ID is required for pricing update");
        await updateTransferPricing(entityId, formData);
        return;

      case "uploadMedia":
        if (!entityId)
          throw new Error("Transfer ID is required for media upload");
        await uploadTransferMedia(entityId, formData);
        return;

      case "updateInformations":
        if (!entityId)
          throw new Error("Transfer ID is required for informations update");
        await updateTransferInformations(entityId, formData);
        return;

      case "updateExtras":
        if (!entityId)
          throw new Error("Transfer ID is required for extras update");
        await updateTransferExtras(entityId, formData);
        return;

      case "updateTerms":
        if (!entityId)
          throw new Error("Transfer ID is required for terms update");
        await updateTransferTerms(entityId, formData);
        return;

      default:
        console.warn(`Unknown action: ${action}`);
    }
  },
};
