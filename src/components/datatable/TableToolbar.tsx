import React from "react";
import { Search } from "lucide-react";

import { FilterIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TableToolbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  onFilterClick?: () => void;
  showFilter?: boolean;
  activeFilterCount?: number;
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
  className?: string;
}

export const TableToolbar: React.FC<TableToolbarProps> = ({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search",
  onFilterClick,
  showFilter = true,
  activeFilterCount = 0,
  primaryButton,
  yearSelector,
  leftSlot,
  rightSlot,
  className = "",
}) => {
  return (
    <div
      className={`items-start justify-between p-3 self-stretch w-full flex-[0_0_auto] bg-gray-25 flex relative ${className}`}
    >
      <div className="flex items-center gap-3 flex-1">
        {leftSlot || (
          <div className="flex flex-col w-[253px] items-start gap-1.5 relative">
            <div className="gap-1.5 flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
              <Input
                className="bg-white"
                placeholder={searchPlaceholder}
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                leftIcon={<Search className="size-4" />}
              />
            </div>
          </div>
        )}

        {yearSelector && (
          <div className="relative">
            <select
              value={yearSelector.value}
              onChange={(e) => yearSelector.onChange?.(e.target.value)}
              className="h-[45px] px-4 py-2.5 bg-basewhite rounded-xl border border-solid border-[#f2f2f2] font-medium appearance-none cursor-pointer pr-10"
            >
              {yearSelector.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {rightSlot}

        {showFilter && (
          <Button
            variant="secondary"
            className="bg-white font-medium text-baseblack relative"
            leftIcon={<FilterIcon className="size-4" />}
            onClick={onFilterClick}
          >
            Filter
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-semibold text-white bg-brand-600 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </Button>
        )}

        {primaryButton && (
          <Button onClick={primaryButton.onClick}>
            {primaryButton.icon && (
              <span className="relative w-5 h-5">{primaryButton.icon}</span>
            )}
            <div className="relative w-fit font-medium text-basewhite">
              {primaryButton.label}
            </div>
          </Button>
        )}
      </div>
    </div>
  );
};
