import type { ListingConfig, ServiceType } from "../types";

import { carConfig } from "./car.config";
import { hospitalConfig } from "./hospital.config";
import { hotelConfig } from "./hotel.config";
import { transferConfig } from "./transfer.config";

// Config registry - maps config key to config
const configRegistry: Record<string, ListingConfig> = {
  car: carConfig,
  hospital: hospitalConfig,
  hotel: hotelConfig,
  transfer: transferConfig,
};

const SERVICE_TYPE_KEY: Record<ServiceType, string> = {
  rent_a_car: "car",
  hotel: "hotel",
  hospital: "hospital",
  transfer: "transfer",
};

/**
 * Get listing configuration by service type
 * @param serviceType - The service type enum value
 * @returns The listing configuration for the given service type
 * @throws Error if no config is found for the service type
 */
export function getListingConfig(serviceType: ServiceType): ListingConfig {
  const key = SERVICE_TYPE_KEY[serviceType];

  if (!key) {
    throw new Error(`Unknown service type: ${serviceType}`);
  }

  const config = configRegistry[key];

  if (!config) {
    throw new Error(
      `No config registered for service type: ${serviceType} (key: ${key})`
    );
  }

  return config;
}

/**
 * Get listing configuration by key
 * @param key - The service type key (e.g., 'car', 'hospital')
 * @returns The listing configuration for the given key
 * @throws Error if no config is found for the key
 */
export function getListingConfigByKey(key: string): ListingConfig {
  const config = configRegistry[key];

  if (!config) {
    throw new Error(`No config registered for key: ${key}`);
  }

  return config;
}

/**
 * Check if a service type has a registered config
 */
export function hasListingConfig(serviceType: ServiceType): boolean {
  const key = SERVICE_TYPE_KEY[serviceType];
  return key ? key in configRegistry : false;
}

/**
 * Get all registered listing types
 */
export function getRegisteredListingTypes(): string[] {
  return Object.keys(configRegistry);
}

// Re-export configs for direct access
export { carConfig } from "./car.config";
export { hospitalConfig } from "./hospital.config";
export { hotelConfig } from "./hotel.config";
export { transferConfig } from "./transfer.config";
