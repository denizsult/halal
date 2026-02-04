import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { getListingActionsColumn } from "./listing-actions-column";

export type HospitalListingRow = Record<string, unknown>;

export const hospitalListingsTableColumns: ColumnDef<HospitalListingRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
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
  getListingActionsColumn<HospitalListingRow>(),
];
