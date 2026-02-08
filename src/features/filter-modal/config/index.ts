import type { CompanyType } from "@/types/api";

import type { FilterConfig } from "../types";

import { activityFilterConfig } from "./activity.filter.config";
import { eventFilterConfig } from "./event.filter.config";
import { flightFilterConfig } from "./flight.filter.config";
import { healthFilterConfig } from "./health.filter.config";
import { hospitalFilterConfig } from "./hospital.filter.config";
import { hotelFilterConfig } from "./hotel.filter.config";
import { rentACarFilterConfig } from "./rent-a-car.filter.config";
import { roomFilterConfig } from "./room.filter.config";
import { tourFilterConfig } from "./tour.filter.config";
import { transferFilterConfig } from "./transfer.filter.config";

// Config registry - maps config key to config
const filterConfigRegistry: Record<string, FilterConfig> = {
  activity: activityFilterConfig,
  car: rentACarFilterConfig,
  event: eventFilterConfig,
  flight: flightFilterConfig,
  health: healthFilterConfig,
  hospital: hospitalFilterConfig,
  hotel: hotelFilterConfig,
  room: roomFilterConfig,
  tour: tourFilterConfig,
  transfer: transferFilterConfig,
};

// Maps CompanyType to config key
const SERVICE_TYPE_KEY: Partial<Record<CompanyType, string>> = {
  rent_a_car: "car",
  hotel: "hotel",
  hospital: "hospital",
  flight: "flight",
  tour: "tour",
  event: "event",
  activity: "activity",
  health: "health",
  room: "room",
  transfer: "transfer",
};

/**
 * Get filter configuration by company type
 * @param companyType - The company type enum value
 * @returns The filter configuration for the given company type
 * @throws Error if no config is found for the company type
 */
export function getFilterConfig(companyType: CompanyType): FilterConfig {
  const key = SERVICE_TYPE_KEY[companyType];

  if (!key) {
    throw new Error(`Unknown or unsupported company type: ${companyType}`);
  }

  const config = filterConfigRegistry[key];

  if (!config) {
    throw new Error(
      `No filter config registered for company type: ${companyType} (key: ${key})`
    );
  }

  return config;
}

/**
 * Check if a company type has a registered filter config
 */
export function hasFilterConfig(companyType: CompanyType): boolean {
  const key = SERVICE_TYPE_KEY[companyType];
  return key ? key in filterConfigRegistry : false;
}

/**
 * Get all registered filter types
 */
export function getRegisteredFilterTypes(): string[] {
  return Object.keys(filterConfigRegistry);
}

// Re-export configs for direct access
export { activityFilterConfig } from "./activity.filter.config";
export { bookingsFilterConfig } from "./bookings.filter.config";
export { eventFilterConfig } from "./event.filter.config";
export { flightFilterConfig } from "./flight.filter.config";
export { healthFilterConfig } from "./health.filter.config";
export { hospitalFilterConfig } from "./hospital.filter.config";
export { hotelFilterConfig } from "./hotel.filter.config";
export { rentACarFilterConfig } from "./rent-a-car.filter.config";
export { roomFilterConfig } from "./room.filter.config";
export { tourFilterConfig } from "./tour.filter.config";
export { transferFilterConfig } from "./transfer.filter.config";
