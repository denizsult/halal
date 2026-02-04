import type { CompanyType } from "@/types/api";

import { activityConfig } from "./activity.config";
import { eventConfig } from "./event.config";
import { flightConfig } from "./flight.config";
import { healthConfig } from "./health.config";
import { hospitalConfig } from "./hospital.config";
import { hotelConfig } from "./hotel.config";
import { rentACarConfig } from "./rentacar.config";
import { roomConfig } from "./room.config";
import { tourConfig } from "./tour.config";
import { transferConfig } from "./transfer.config";
import type { ModuleListingsConfig } from "./types";

const moduleConfigs: Record<CompanyType, ModuleListingsConfig> = {
  rent_a_car: rentACarConfig,
  hotel: hotelConfig,
  hospital: hospitalConfig,
  flight: flightConfig,
  transfer: transferConfig,
  tour: tourConfig,
  event: eventConfig,
  activity: activityConfig,
  health: healthConfig,
  room: roomConfig,
};

/**
 * Returns the listings config for the given company type.
 * Use this to build listing API URLs from user.company.type.
 */
export function getModuleListingsConfig(
  companyType: CompanyType | undefined
): ModuleListingsConfig | null {
  return companyType ? (moduleConfigs[companyType] ?? null) : null;
}

/**
 * Resolves an endpoint URL by replacing :id with the given id.
 */
export function resolveListingUrl(url: string, id?: number): string {
  if (id != null) {
    return url.replace(":id", String(id));
  }
  return url;
}

export { moduleConfigs };
export { activityConfig } from "./activity.config";
export { eventConfig } from "./event.config";
export { flightConfig } from "./flight.config";
export { healthConfig } from "./health.config";
export { hospitalConfig } from "./hospital.config";
export { hotelConfig } from "./hotel.config";
export { rentACarConfig } from "./rentacar.config";
export { roomConfig } from "./room.config";
export { tourConfig } from "./tour.config";
export { transferConfig } from "./transfer.config";
export * from "./types";
