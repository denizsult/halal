import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import type { RentACarPricingResource } from "@/types/api";

import { getListingActionsColumn } from "./listing-actions-column";

/**
 * Row shape aligned with backend RentACarListingResource.
 * @see halal-backend/app/Http/Resources/RentACar/RentACarListingResource.php
 */
export type RentACarListingRow = Record<string, unknown>;

const getRecord = (value: unknown): Record<string, unknown> | undefined => {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }
  return undefined;
};

const getDisplayValue = (...values: unknown[]): string | undefined => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value;
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }
  return undefined;
};

const getImageUrlFromImages = (images: unknown): string | undefined => {
  if (!Array.isArray(images) || images.length === 0) return undefined;
  const mainImage = images.find((image) => getRecord(image)?.is_main === true);
  const candidate = mainImage ?? images[0];
  const record = getRecord(candidate);
  if (!record) return undefined;
  return getDisplayValue(
    record.file_url,
    record.url,
    record.image_url,
    record.thumbnail,
    record.path
  );
};

const getCarRecord = (
  row: RentACarListingRow
): Record<string, unknown> | undefined =>
  getRecord(row.car) ?? getRecord(row.listing) ?? getRecord(row.vehicle);

const getCustomerRecord = (
  row: RentACarListingRow
): Record<string, unknown> | undefined =>
  getRecord(row.customer) ?? getRecord(row.user) ?? getRecord(row.client);

const getCarName = (row: RentACarListingRow): string | undefined => {
  const car = getCarRecord(row);
  const listing = getRecord(row.listing);
  return getDisplayValue(
    row.car_name,
    row.full_name,
    row.name,
    row.title,
    car?.full_name,
    car?.name,
    car?.title,
    listing?.name,
    listing?.title
  );
};

const getCarImageUrl = (row: RentACarListingRow): string | undefined => {
  const car = getCarRecord(row);
  const listing = getRecord(row.listing);
  const directUrl = getDisplayValue(
    row.image_url,
    row.image,
    row.thumbnail,
    car?.image_url,
    car?.image,
    car?.thumbnail,
    listing?.image_url,
    listing?.image,
    listing?.thumbnail
  );
  if (directUrl) return directUrl;

  const imageSources = [row.images, car?.images, listing?.images];
  for (const source of imageSources) {
    const url = getImageUrlFromImages(source);
    if (url) return url;
  }
  return undefined;
};

/** Listings table columns matched to RentACarListingResource fields. */
export const rentacarListingsTableColumns: ColumnDef<RentACarListingRow>[] = [
  {
    accessorKey: "id",
    header: "Rank",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="font-medium text-gray-900">
        {row.original.id != null ? String(row.original.id) : row.index + 1}
      </span>
    ),
  },
  {
    accessorKey: "full_name",
    header: "Car Name",
    enableSorting: true,
    cell: ({ row }) => {
      const mainImageUrl = row.original.main_image_url as string | undefined;
      const fullName = (row.original.full_name as string) ?? "—";
      const about = (row.original.about as string) ?? "";
      return (
        <div className="flex items-center gap-3">
          {mainImageUrl ? (
            <img
              src={mainImageUrl}
              alt={fullName}
              className="size-10 shrink-0 rounded-md object-cover"
            />
          ) : (
            <div className="size-10 shrink-0 rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-400">
              —
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-sm text-gray-900 truncate">
              {fullName}
            </span>
            {about ? (
              <span className="text-gray-500 text-xs truncate max-w-[200px]">
                {about}
              </span>
            ) : null}
          </div>
        </div>
      );
    },
    meta: { width: "260px" },
  },
  {
    id: "model",
    accessorFn: (row) => (getRecord(row.model)?.name as string) ?? "",
    header: "Car Type",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-gray-600">
        {(getRecord(row.original.model)?.name as string) ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "year",
    header: "Year",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-gray-600">
        {row.original.year != null ? String(row.original.year) : "—"}
      </span>
    ),
  },
  {
    accessorKey: "fuel_type_label",
    header: "Fuel Type",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-gray-600">
        {(row.original.fuel_type_label as string) ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "transmission_type_label",
    header: "Transmission",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-gray-600">
        {(row.original.transmission_type_label as string) ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "seats",
    header: "Seats",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-gray-600">
        {row.original.seats != null ? String(row.original.seats) : "—"}
      </span>
    ),
  },
  {
    accessorKey: "luggage_capacity",
    header: "Luggage",
    enableSorting: true,
    cell: ({ row }) => {
      const cap = row.original.luggage_capacity;
      return (
        <span className="text-gray-600">
          {cap != null ? `${cap} Bags` : "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "status_label",
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => {
      const status =
        (row.original.status_label as string) ??
        (row.original.status as string) ??
        "—";
      return (
        <Badge
          variant={
            String(status).toLowerCase() === "active" ? "default" : "secondary"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "price",
    header: "Price/Day",
    enableSorting: true,
    cell: ({ row }) => {
      const pricing = getRecord(row.original.pricing) as
        | RentACarPricingResource
        | undefined;
      const value = pricing?.medium_price;
      return (
        <span className="font-medium text-gray-900">
          {value != null ? `$${Number(value).toFixed(2)}` : "—"}
        </span>
      );
    },
  },
  getListingActionsColumn<RentACarListingRow>(),
];

export const rentacarBookingsTableColumns: ColumnDef<RentACarListingRow>[] = [
  {
    id: "rank_car_name",
    header: "Rank Car Name",
    accessorFn: (row) => getCarName(row) ?? "",
    enableSorting: true,
    cell: ({ row }) => {
      const carName = getCarName(row.original) ?? "—";
      const imageUrl = getCarImageUrl(row.original);
      const fallbackLabel =
        carName !== "—" ? carName.slice(0, 2).toUpperCase() : "—";
      return (
        <div className="flex items-center gap-3">
          <span className="w-5 text-xs font-semibold text-gray-500">
            {row.index + 1}
          </span>
          <div className="size-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center text-xs text-gray-400">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={carName}
                className="size-full object-cover"
              />
            ) : (
              <span className="uppercase">{fallbackLabel}</span>
            )}
          </div>
          <span className="font-medium text-gray-900 truncate max-w-[180px]">
            {carName}
          </span>
        </div>
      );
    },
    meta: { width: "240px" },
  },
  {
    accessorKey: "car_type",
    header: "Car Type",
    cell: ({ row }) => {
      const car = getCarRecord(row.original);
      const value = getDisplayValue(
        row.original.car_type_label,
        row.original.car_type,
        car?.car_type_label,
        car?.type_label,
        car?.car_type,
        car?.type
      );
      return <span className="text-gray-600">{value ?? "—"}</span>;
    },
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => {
      const car = getCarRecord(row.original);
      const value = getDisplayValue(
        row.original.color,
        row.original.car_color,
        car?.color
      );
      return <span className="text-gray-600">{value ?? "—"}</span>;
    },
  },
  {
    accessorKey: "customer_name",
    header: "Customer Name",
    cell: ({ row }) => {
      const customer = getCustomerRecord(row.original);
      const firstName = getDisplayValue(customer?.first_name);
      const lastName = getDisplayValue(customer?.last_name);
      const fullName =
        firstName && lastName ? `${firstName} ${lastName}` : undefined;
      const value = getDisplayValue(
        row.original.customer_name,
        customer?.full_name,
        customer?.name,
        fullName
      );
      return (
        <span className="text-gray-600 truncate block max-w-[180px]">
          {value ?? "—"}
        </span>
      );
    },
    meta: { width: "180px" },
  },
  {
    accessorKey: "pickup_location",
    header: "Pickup Location",
    cell: ({ row }) => {
      const pickup = getRecord(row.original.pickup);
      const value = getDisplayValue(
        row.original.pickup_location,
        row.original.pickup_address,
        row.original.location,
        pickup?.location,
        pickup?.address,
        pickup?.name
      );
      return (
        <span className="text-gray-600 truncate block max-w-[200px]">
          {value ?? "—"}
        </span>
      );
    },
    meta: { width: "200px" },
  },
  {
    accessorKey: "seats",
    header: "Seats",
    cell: ({ row }) => {
      const car = getCarRecord(row.original);
      const value = getDisplayValue(
        row.original.seats,
        row.original.seat_count,
        car?.seats
      );
      return <span className="text-gray-600">{value ?? "—"}</span>;
    },
  },
  {
    accessorKey: "luggage",
    header: "Luggage",
    cell: ({ row }) => {
      const car = getCarRecord(row.original);
      const value = getDisplayValue(
        row.original.luggage,
        row.original.luggage_capacity,
        row.original.luggage_count,
        car?.luggage_capacity,
        car?.luggage
      );
      return <span className="text-gray-600">{value ?? "—"}</span>;
    },
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => {
      const value = getDisplayValue(
        row.original.time,
        row.original.pickup_time,
        row.original.start_time,
        row.original.booking_time
      );
      return <span className="text-gray-600">{value ?? "—"}</span>;
    },
  },
  {
    accessorKey: "transmission",
    header: "Transmission",
    cell: ({ row }) => {
      const car = getCarRecord(row.original);
      const value = getDisplayValue(
        row.original.transmission_type_label,
        row.original.transmission,
        car?.transmission_type_label,
        car?.transmission
      );
      return <span className="text-gray-600">{value ?? "—"}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status =
        getDisplayValue(
          row.original.status_label,
          row.original.status,
          row.original.booking_status
        ) ?? "—";
      const normalized = String(status).toLowerCase();
      const isActive = ["active", "confirmed", "completed"].includes(
        normalized
      );
      return (
        <Badge variant={isActive ? "default" : "secondary"}>{status}</Badge>
      );
    },
  },
  {
    id: "price_per_day",
    header: "Price/Day",
    cell: ({ row }) => {
      const car = getCarRecord(row.original);
      const pricing = getRecord(row.original.pricing);
      const value = getDisplayValue(
        row.original.price_per_day,
        row.original.price_day,
        row.original.daily_price,
        row.original.price,
        pricing?.medium_price,
        car?.price_per_day,
        car?.price
      );
      return <span className="font-medium text-gray-900">{value ?? "—"}</span>;
    },
  },
  {
    accessorKey: "fuel_type",
    header: "Fuel Type",
    cell: ({ row }) => {
      const car = getCarRecord(row.original);
      const value = getDisplayValue(
        row.original.fuel_type_label,
        row.original.fuel_type,
        car?.fuel_type_label,
        car?.fuel_type
      );
      return <span className="text-gray-600">{value ?? "—"}</span>;
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const car = getCarRecord(row.original);
      const value = getDisplayValue(
        row.original.rating,
        row.original.car_rating,
        car?.rating
      );
      return <span className="text-gray-600">{value ?? "—"}</span>;
    },
  },
  getListingActionsColumn<RentACarListingRow>(),
];
