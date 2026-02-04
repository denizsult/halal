import type { ServiceType } from "../types";

import { carApiService } from "./car.service";
import { hospitalApiService } from "./hospital.service";
import { hotelApiService } from "./hotel.service";
import { transferApiService } from "./transfer.service";

// Service interface that all listing services must implement
export interface ListingApiService {
  getListing: (id: number) => Promise<Record<string, unknown>>;
  executeStepAction: (
    action: string,
    formData: Record<string, unknown>,
    entityId: number | null,
    appUserId?: string | number
  ) => Promise<{ id?: number } | void>;
}

// Service registry
const serviceRegistry: Record<string, ListingApiService> = {
  car: carApiService,
  hospital: hospitalApiService,
  hotel: hotelApiService,
  transfer: transferApiService,
};

const SERVICE_TYPE_KEY: Record<ServiceType, string> = {
  rent_a_car: "car",
  hotel: "hotel",
  hospital: "hospital",
  transfer: "transfer",
};

/**
 * Get API service for a specific listing type
 * @param serviceType - The service type enum value
 * @returns The API service for the given service type
 * @throws Error if no service is found
 */
export function getApiService(serviceType: ServiceType): ListingApiService {
  const key = SERVICE_TYPE_KEY[serviceType];

  if (!key) {
    throw new Error(`Unknown service type: ${serviceType}`);
  }

  const service = serviceRegistry[key];

  if (!service) {
    throw new Error(
      `No API service registered for service type: ${serviceType} (key: ${key})`
    );
  }

  return service;
}

// Re-export individual services
export { carApiService } from "./car.service";
export { hospitalApiService } from "./hospital.service";
export { hotelApiService } from "./hotel.service";
export { transferApiService } from "./transfer.service";
