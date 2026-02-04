import { type ReactNode } from "react";
import {
  type ColumnDef,
  // type Table as TanStackTable,
} from "@tanstack/react-table";

export interface Column<T = any> {
  id: string;
  header: string;
  accessor?: keyof T | ((row: T) => ReactNode);
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (value: any, row: T) => ReactNode;
}

export interface SortState {
  columnId: string;
  direction: "asc" | "desc";
}

export interface PaginationState {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems?: number;
}

export type DataTableColumn<T> = ColumnDef<T>;
