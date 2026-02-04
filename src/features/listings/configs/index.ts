import type { ColumnDef } from "@tanstack/react-table";

import type { CompanyType } from "@/types/api";

import type { ListingsView } from "../types";

import { activityListingsTableColumns } from "./activity.listings.table";
import { eventListingsTableColumns } from "./event.listings.table";
import { flightListingsTableColumns } from "./flight.listings.table";
import { healthListingsTableColumns } from "./health.listings.table";
import { hospitalListingsTableColumns } from "./hospital.listings.table";
import { hotelListingsTableColumns } from "./hotel.listings.table";
import {
  rentacarBookingsTableColumns,
  rentacarListingsTableColumns,
} from "./rentacar.listings.table";
import { roomListingsTableColumns } from "./room.listings.table";
import { tourListingsTableColumns } from "./tour.listings.table";
import { transferListingsTableColumns } from "./transfer.listings.table";

export type ListingTableRow = Record<string, unknown>;

const listingTableColumnsByType: Record<
  CompanyType,
  ColumnDef<ListingTableRow>[]
> = {
  rent_a_car: rentacarListingsTableColumns,
  hotel: hotelListingsTableColumns,
  hospital: hospitalListingsTableColumns,
  flight: flightListingsTableColumns,
  transfer: transferListingsTableColumns,
  tour: tourListingsTableColumns,
  event: eventListingsTableColumns,
  activity: activityListingsTableColumns,
  health: healthListingsTableColumns,
  room: roomListingsTableColumns,
};

const bookingsTableColumnsByType: Partial<
  Record<CompanyType, ColumnDef<ListingTableRow>[]>
> = {
  rent_a_car: rentacarBookingsTableColumns,
};

/**
 * Returns the table column definitions for the given company type.
 * Use in ListingsPage with useListings data.
 */
export function getListingsTableColumns(
  companyType: CompanyType | undefined,
  view: ListingsView = "listings"
): ColumnDef<ListingTableRow>[] {
  if (!companyType || !(companyType in listingTableColumnsByType)) {
    return [];
  }
  if (view === "bookings") {
    return (
      bookingsTableColumnsByType[companyType] ??
      listingTableColumnsByType[companyType]
    );
  }
  return listingTableColumnsByType[companyType];
}

export { activityListingsTableColumns } from "./activity.listings.table";
export { eventListingsTableColumns } from "./event.listings.table";
export { flightListingsTableColumns } from "./flight.listings.table";
export { healthListingsTableColumns } from "./health.listings.table";
export { hospitalListingsTableColumns } from "./hospital.listings.table";
export { hotelListingsTableColumns } from "./hotel.listings.table";
export { getListingActionsColumn } from "./listing-actions-column";
export {
  rentacarBookingsTableColumns,
  rentacarListingsTableColumns,
} from "./rentacar.listings.table";
export { roomListingsTableColumns } from "./room.listings.table";
export { tourListingsTableColumns } from "./tour.listings.table";
export { transferListingsTableColumns } from "./transfer.listings.table";
