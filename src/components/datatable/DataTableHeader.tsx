import Checkbox from "@/components/form/input/checkbox";
import { SortDownIcon } from "@/components/icons";

import { type Column, type SortState } from "./types";

interface DataTableHeaderProps {
  columns: Column[];
  showCheckbox?: boolean;
  allChecked?: boolean;
  onCheckAll?: (checked: boolean) => void;
  sortState?: SortState;
  onSort?: (columnId: string) => void;
  sticky?: boolean;
  className?: string;
}

export const DataTableHeader: React.FC<DataTableHeaderProps> = ({
  columns,
  showCheckbox = false,
  allChecked = false,
  onCheckAll,
  sortState,
  onSort,
  sticky = false,
  className = "",
}) => {
  return (
    <div
      className={`items-center px-0 py-1 flex relative self-stretch w-full flex-[0_0_auto] bg-gray-25 overflow-hidden border-t border-b border-solid border-[#f2f2f2] ${
        sticky ? "sticky top-0 z-10" : ""
      } ${className}`}
    >
      {showCheckbox && (
        <div className="h-[34px] gap-1 inline-flex items-center p-2 relative flex-[0_0_auto]">
          <Checkbox
            checked={allChecked}
            onChange={(checked) => onCheckAll?.(checked)}
          />
        </div>
      )}

      {columns.map((column) => (
        <div
          key={column.id}
          className={`flex items-center gap-1 p-2 relative shrink-0 ${
            column.width ? "" : "flex-1 min-w-0"
          } ${column.sortable ? "cursor-pointer hover:bg-gray-50" : ""}`}
          style={column.width ? { width: column.width } : undefined}
          onClick={() => column.sortable && onSort?.(column.id)}
        >
          <p
            className={`font-semibold text-sm text-[#919191] whitespace-nowrap ${
              column.align === "center"
                ? "text-center"
                : column.align === "right"
                  ? "text-right"
                  : "text-left"
            }`}
          >
            {column.header}
          </p>
          {column.sortable && (
            <div className="flex flex-col text-[#919191]">
              {sortState?.columnId === column.id ? (
                sortState.direction === "asc" ? (
                  <SortDownIcon />
                ) : (
                  <SortDownIcon className="rotate-180" />
                )
              ) : (
                <div className="flex flex-col -my-1">
                  <SortDownIcon />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
