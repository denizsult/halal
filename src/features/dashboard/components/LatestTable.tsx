import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import type { LatestTableConfig } from "../dashboard.types";

export const LatestTable = ({ config }: { config: LatestTableConfig }) => (
  <Table className="min-w-[640px]">
    <TableHeader>
      <TableRow className="border-gray-100">
        {config.columns.map((column) => (
          <TableHead
            key={column.key}
            className={cn(
              "text-xs uppercase tracking-wide text-gray-400 font-medium",
              column.headerClassName
            )}
          >
            {column.label}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
    <TableBody>
      {config.rows.map((row) => (
        <TableRow key={row.id} className="border-gray-100">
          {config.columns.map((column) => (
            <TableCell
              key={`${row.id}-${column.key}`}
              className={cn("text-sm text-gray-600", column.cellClassName)}
            >
              {row.cells[column.key]}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
