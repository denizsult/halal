"use client";

import { Controller, useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FilterDateFieldProps {
  name: string;
  label: string;
  placeholder?: string;
}

export function FilterDateField({
  name,
  label,
  placeholder = "Select date",
}: FilterDateFieldProps) {
  const { control } = useFormContext();

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-900">{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="w-full bg-white text-gray-900 border border-gray-200 rounded-xl px-3 py-2 text-sm text-left flex items-center justify-between gap-3 hover:bg-gray-50 focus:outline-none focus-visible:border-brand-300 focus-visible:ring-2 focus-visible:ring-brand-100 transition-all ease-in"
              >
                <span
                  className={field.value ? "text-gray-900" : "text-gray-400"}
                >
                  {field.value
                    ? format(new Date(field.value), "MMM d, yyyy")
                    : placeholder}
                </span>
                <CalendarIcon className="size-5 text-gray-400" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              sideOffset={8}
              className="w-auto p-0 bg-white border border-gray-200 shadow-md"
            >
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => field.onChange(date ?? null)}
              />
            </PopoverContent>
          </Popover>
        )}
      />
    </div>
  );
}
