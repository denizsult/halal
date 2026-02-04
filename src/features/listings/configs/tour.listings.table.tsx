import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { getListingActionsColumn } from "./listing-actions-column";

export type TourListingRow = Record<string, unknown>;

export const tourListingsTableColumns: ColumnDef<TourListingRow>[] = [
  {
    accessorKey: "name",
    header: "Tour",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="font-medium text-gray-900">
        {(row.original.name as string) ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <span className="text-gray-600">
        {(row.original.duration as string) ?? "—"}
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
  getListingActionsColumn<TourListingRow>(),
];
