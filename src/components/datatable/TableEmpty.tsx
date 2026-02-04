import React from "react";

interface TableEmptyProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const TableEmpty: React.FC<TableEmptyProps> = ({
  title = "No data available",
  description = "There are no records to display at the moment.",
  icon,
  action,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-16 px-4 relative self-stretch w-full ${className}`}
    >
      {icon && <div className="text-gray-400">{icon}</div>}

      <div className="flex flex-col items-center gap-2">
        <div className="font-semibold text-baseblack text-base">{title}</div>
        <p className="font-normal text-gray-500 text-sm">{description}</p>
      </div>

      {action && (
        <button
          onClick={action.onClick}
          className="all-[unset] box-border flex min-h-11 items-center justify-center gap-2.5 px-4 py-2.5 relative bg-brand-500 rounded-xl hover:bg-brand-600 transition-colors cursor-pointer"
        >
          <div className="relative w-fit font-medium text-basewhite">
            {action.label}
          </div>
        </button>
      )}
    </div>
  );
};
