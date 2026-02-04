import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { getListingActionsColumn } from "./listing-actions-column";

export type HotelListingRow = Record<string, unknown>;

export const hotelListingsTableColumns: ColumnDef<HotelListingRow>[] = [
  {
    accessorKey: "name",
    header: "Room / Unit",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="font-medium text-gray-900">
        {(row.original.name as string) ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "room_type",
    header: "Type",
    cell: ({ row }) => (
      <span className="text-gray-600">
        {(row.original.room_type as string) ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
    cell: ({ row }) => (
      <span className="text-gray-600">
        {row.original.capacity != null ? String(row.original.capacity) : "—"}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <span className="font-medium text-gray-900">
        {row.original.price != null ? String(row.original.price) : "—"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.original.status as string) ?? "—";
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
  getListingActionsColumn<HotelListingRow>(),
];
