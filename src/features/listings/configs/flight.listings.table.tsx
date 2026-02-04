import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { getListingActionsColumn } from "./listing-actions-column";

export type FlightListingRow = Record<string, unknown>;

export const flightListingsTableColumns: ColumnDef<FlightListingRow>[] = [
  {
    accessorKey: "name",
    header: "Flight / Route",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="font-medium text-gray-900">
        {(row.original.name as string) ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "route",
    header: "Route",
    cell: ({ row }) => (
      <span className="text-gray-600">
        {(row.original.route as string) ?? "—"}
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
  getListingActionsColumn<FlightListingRow>(),
];
