"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type ComboboxOption = {
  id: string | number;
  name: string;
  value?: string;
};

type ComboboxProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  options: ComboboxOption[];
  required?: boolean;
  hasError?: boolean;
  hintText?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
};

export function Combobox({
  label,
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No option found.",
  options,
  required,
  hasError,
  hintText,
  loading,
  disabled,
  className,
  triggerClassName,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find(
    (opt) => String(opt.value ?? opt.id) === value
  );
  const displayValue = selectedOption?.name ?? (value || null);

  const handleSelect = (val: string) => {
    onChange(val === value ? "" : val);
    setOpen(false);
  };

  return (
    <div className={cn("mb-3", className)}>
      {label && (
        <Label className="text-[#222] text-[14px] font-semibold mb-[6px] block">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={loading || disabled}
            className={cn(
              "w-full h-[45px] px-3 py-2 text-sm font-normal justify-between rounded-lg bg-white border hover:bg-white hover:border-[#222]/20",
              hasError ? "border-[#FF7F7F]" : "border-[#F2F2F2]",
              loading && "opacity-60 cursor-not-allowed",
              !displayValue && "text-muted-foreground",
              triggerClassName
            )}
          >
            <span className="truncate">
              {loading ? "Loading..." : (displayValue ?? placeholder)}
            </span>
            <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} className="h-9" />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const optionValue = String(option.value ?? option.id);
                  const isSelected = value === optionValue;
                  return (
                    <CommandItem
                      key={option.id}
                      value={option.name}
                      onSelect={() => handleSelect(optionValue)}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 size-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.name}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {hintText && (
        <p
          className={cn(
            "mt-[6px] text-xs",
            hasError ? "text-[#ba0606]" : "text-[#5A5A5A]"
          )}
        >
          {hintText}
        </p>
      )}
    </div>
  );
}
