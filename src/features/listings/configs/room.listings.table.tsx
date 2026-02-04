import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { getListingActionsColumn } from "./listing-actions-column";

export type RoomListingRow = Record<string, unknown>;

export const roomListingsTableColumns: ColumnDef<RoomListingRow>[] = [
  {
    accessorKey: "name",
    header: "Room",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="font-medium text-gray-900">
        {(row.original.name as string) ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="text-gray-600">
        {(row.original.type as string) ?? "—"}
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
  getListingActionsColumn<RoomListingRow>(),
];
