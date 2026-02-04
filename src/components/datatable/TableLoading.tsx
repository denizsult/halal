import { type ColumnDef } from "@tanstack/react-table";

interface TableLoadingProps<T> {
  columns: ColumnDef<T>[];
  rows?: number;
  showCheckbox?: boolean;
  className?: string;
}

export function TableLoading<T>({
  columns,
  rows = 5,
  showCheckbox = false,
  className = "",
}: TableLoadingProps<T>) {
  return (
    <div
      className={`flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] ${className}`}
    >
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className={`flex items-start relative self-stretch w-full flex-[0_0_auto] overflow-hidden border-b border-solid border-gray-200 ${
            rowIndex % 2 === 1 ? "bg-gray-25" : "bg-basewhite"
          }`}
        >
          {showCheckbox && (
            <div className="min-w-[34px] gap-2.5 self-stretch inline-flex items-center p-2 relative flex-[0_0_auto]">
              <div className="w-[18px] h-[18px] bg-gray-100 rounded animate-pulse" />
            </div>
          )}

          {columns.map((column, colIndex) => (
            <div
              key={colIndex}
              className={`flex items-center gap-2.5 p-2 relative self-stretch ${
                (column.meta as any)?.width || "flex-1"
              }`}
            >
              <div className="flex flex-col items-start justify-center gap-2 relative flex-1 grow">
                <div className="w-full h-3 bg-gray-100 rounded animate-pulse" />
                {colIndex === 0 && (
                  <div className="w-3/4 h-2 bg-gray-100 rounded animate-pulse" />
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
