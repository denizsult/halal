import { z } from "zod";

import type { ServiceType } from "../types";

import { carSchemas } from "./car.schema";
import { hospitalSchemas } from "./hospital.schema";
import { hotelSchemas } from "./hotel.schema";
import { transferSchemas } from "./transfer.schema";

// Schema registry - maps config key to array of step schemas
const schemaRegistry: Record<string, z.ZodSchema[]> = {
  car: carSchemas,
  hospital: hospitalSchemas,
  hotel: hotelSchemas,
  transfer: transferSchemas,
};

const SERVICE_TYPE_KEY: Record<ServiceType, string> = {
  rent_a_car: "car",
  hotel: "hotel",
  hospital: "hospital",
  transfer: "transfer",
};

/**
 * Get validation schema for a specific step
 * @param serviceType - The service type enum value
 * @param stepIndex - The current step index (0-based)
 * @returns The Zod schema for the given step
 * @throws Error if no schema is found
 */
export function getValidationSchema(
  serviceType: ServiceType,
  stepIndex: number
): z.ZodSchema {
  const key = SERVICE_TYPE_KEY[serviceType];

  if (!key) {
    throw new Error(`Unknown service type: ${serviceType}`);
  }

  const schemas = schemaRegistry[key];

  if (!schemas) {
    throw new Error(
      `No schemas registered for service type: ${serviceType} (key: ${key})`
    );
  }

  if (stepIndex < 0 || stepIndex >= schemas.length) {
    throw new Error(
      `Invalid step index: ${stepIndex}. Valid range: 0-${schemas.length - 1}`
    );
  }

  return schemas[stepIndex];
}

/**
 * Get all schemas for a service type
 * @param serviceType - The service type enum value
 * @returns Array of Zod schemas for all steps
 */
export function getAllSchemas(serviceType: ServiceType): z.ZodSchema[] {
  const key = SERVICE_TYPE_KEY[serviceType];

  if (!key) {
    throw new Error(`Unknown service type: ${serviceType}`);
  }

  const schemas = schemaRegistry[key];

  if (!schemas) {
    throw new Error(
      `No schemas registered for service type: ${serviceType} (key: ${key})`
    );
  }

  return schemas;
}

/**
 * Get the number of steps for a service type
 */
export function getStepCount(serviceType: ServiceType): number {
  const schemas = getAllSchemas(serviceType);
  return schemas.length;
}

// Re-export individual schemas
export * from "./car.schema";
export * from "./hospital.schema";
export * from "./hotel.schema";
export * from "./transfer.schema";
