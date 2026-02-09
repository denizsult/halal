"use client";

import React, { useMemo, useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { FilterModal } from "@/components/filter-modal";
import Checkbox from "@/components/form/input/checkbox";
import {
  DynamicFilterModal,
  type FilterState,
  getFilterConfig,
} from "@/features/filter-modal";
import type { CompanyType } from "@/types/api";

import { TableBody } from "./DataTableBody";
import { DataTableHeader } from "./DataTableHeader";
import { TableEmpty } from "./TableEmpty";
import { TableLoading } from "./TableLoading";
import { TablePagination } from "./TablePagination";
import { TableToolbar } from "./TableToolbar";

interface DataTableProps<T extends Record<string, any>> {
  columns: ColumnDef<T>[];
  data: T[];
  loading?: boolean;
  className?: string;
  // Pagination
  pagination?: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems?: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    pageSizeOptions?: number[];
  };
  // Sorting
  sorting?: {
    enabled?: boolean;
    onSortChange?: (
      sorting: { columnId: string; direction: "asc" | "desc" } | null
    ) => void;
  };
  // Selection
  selection?: {
    enabled?: boolean;
    selectedRows?: T[];
    onSelectionChange?: (selectedRows: T[]) => void;
  };
  // Toolbar
  toolbar?: {
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    onFilterClick?: () => void;
    showFilter?: boolean;
    primaryButton?: {
      label: string;
      onClick: () => void;
      icon?: React.ReactNode;
    };
    yearSelector?: {
      value: string;
      options: { label: string; value: string }[];
      onChange: (value: string) => void;
    };
    leftSlot?: React.ReactNode;
    rightSlot?: React.ReactNode;
  };
  // Empty state
  emptyState?: {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  // Loading
  loadingRows?: number;
  showCheckbox?: boolean;
  stickyHeader?: boolean;
  // Filter
  filterServiceType?: CompanyType;
  onFilterApply?: (filters: FilterState) => void;
  onFilterClear?: () => void;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  className = "",
  pagination,
  sorting,
  // selection,
  toolbar,
  emptyState,
  loadingRows = 5,
  showCheckbox = false,
  stickyHeader = false,
  filterServiceType,
  onFilterApply,
  onFilterClear,
}: DataTableProps<T>) {
  const [sortingState, setSortingState] = useState<SortingState>([]);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Convert sorting state to our format
  React.useEffect(() => {
    if (sorting?.onSortChange) {
      if (sortingState.length > 0) {
        const sort = sortingState[0];
        sorting.onSortChange({
          columnId: sort.id,
          direction: sort.desc ? "desc" : "asc",
        });
      } else {
        sorting.onSortChange(null);
      }
    }
  }, [sortingState, sorting]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel:
      sorting?.enabled !== false ? getSortedRowModel() : undefined,
    getPaginationRowModel: pagination ? undefined : getPaginationRowModel(),
    state: {
      sorting: sorting?.enabled !== false ? sortingState : undefined,
    },
    onSortingChange: setSortingState,
    manualPagination: !!pagination,
    manualSorting: !!sorting,
    pageCount: pagination?.totalPages,
  });

  // Convert TanStack columns to our Column format for DataTableHeader
  const headerColumns = useMemo(() => {
    return columns.map((col) => {
      const meta = (col.meta as any) || {};
      return {
        id: col.id || (col as any).accessorKey || "",
        header: typeof col.header === "string" ? col.header : "",
        width: meta.width,
        align: meta.align || "left",
        sortable: col.enableSorting !== false,
      };
    });
  }, [columns]);

  const handleSort = (columnId: string) => {
    const column = table.getColumn(columnId);
    if (column) {
      column.toggleSorting();
    }
  };

  const getSortState = () => {
    const sortedColumn = sortingState[0];
    if (!sortedColumn) return undefined;
    return {
      columnId: sortedColumn.id,
      direction: sortedColumn.desc ? "desc" : ("asc" as "asc" | "desc"),
    };
  };

  const handleFilterClick = () => {
    setFilterOpen(true);

    toolbar?.onFilterClick?.();
  };

  return (
    <div
      className={`flex flex-col w-full bg-white rounded-lg overflow-hidden border-2 border-solid border-[#f2f2f2] ${className}`}
    >
      {toolbar && (
        <TableToolbar
          searchValue={toolbar.searchValue}
          onSearchChange={toolbar.onSearchChange}
          searchPlaceholder={toolbar.searchPlaceholder}
          onFilterClick={handleFilterClick}
          showFilter={toolbar.showFilter}
          activeFilterCount={activeFilterCount}
          primaryButton={toolbar.primaryButton}
          yearSelector={toolbar.yearSelector}
          leftSlot={toolbar.leftSlot}
          rightSlot={toolbar.rightSlot}
        />
      )}

      <div className="overflow-x-auto min-w-0">
        <div className="min-w-max">
          <DataTableHeader
            columns={headerColumns}
            showCheckbox={showCheckbox}
            allChecked={table.getIsAllRowsSelected()}
            onCheckAll={(checked) => table.toggleAllRowsSelected(checked)}
            sortState={getSortState()}
            onSort={handleSort}
            sticky={stickyHeader}
          />

          {loading ? (
            <TableLoading
              columns={columns}
              rows={loadingRows}
              showCheckbox={showCheckbox}
            />
          ) : data.length === 0 ? (
            <TableEmpty
              title={emptyState?.title}
              description={emptyState?.description}
              icon={emptyState?.icon}
              action={emptyState?.action}
            />
          ) : (
            <TableBody>
              {table.getRowModel().rows.map((row, rowIndex) => (
                <div
                  key={row.id}
                  className={`flex items-start relative self-stretch w-full flex-[0_0_auto] border-b border-solid border-gray-200 ${
                    rowIndex % 2 === 1 ? "bg-gray-25" : "bg-basewhite"
                  }`}
                >
                  {showCheckbox && (
                    <div className="min-w-[34px] gap-2.5 self-stretch inline-flex items-center p-2 relative flex-[0_0_auto]">
                      <Checkbox
                        checked={row.getIsSelected()}
                        onChange={(checked) => row.toggleSelected(checked)}
                      />
                    </div>
                  )}

                  {row.getVisibleCells().map((cell) => {
                    const meta = (cell.column.columnDef.meta as any) || {};
                    return (
                      <div
                        key={cell.id}
                        className={`flex items-center gap-2.5 p-2 relative self-stretch ${
                          meta.width ? "" : "flex-1"
                        } ${
                          meta.align === "center"
                            ? "justify-center"
                            : meta.align === "right"
                              ? "justify-end"
                              : ""
                        }`}
                        style={meta.width ? { width: meta.width } : undefined}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </TableBody>
          )}
        </div>
      </div>

      {pagination && (
        <TablePagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
          pageSizeOptions={pagination.pageSizeOptions}
        />
      )}

      {toolbar?.showFilter &&
        (filterServiceType ? (
          <DynamicFilterModal
            isOpen={isFilterOpen}
            onClose={() => setFilterOpen(false)}
            serviceType={filterServiceType}
            onApply={(filters) => {
              // Calculate active filter count
              const config = getFilterConfig(filterServiceType);
              const defaults = config.defaultValues;
              let count = 0;
              for (const [key, value] of Object.entries(filters)) {
                const defaultValue = defaults[key];
                if (value !== defaultValue && value !== null && value !== "") {
                  count++;
                }
              }
              setActiveFilterCount(count);
              onFilterApply?.(filters);
              setFilterOpen(false);
            }}
            onClear={() => {
              setActiveFilterCount(0);
              onFilterClear?.();
            }}
          />
        ) : (
          <FilterModal
            isOpen={isFilterOpen}
            onClose={() => setFilterOpen(false)}
          />
        ))}
    </div>
  );
}
