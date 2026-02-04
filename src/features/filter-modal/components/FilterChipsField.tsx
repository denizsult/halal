"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Label } from "@/components/ui/label";

interface FilterChipsFieldProps {
  name: string;
  label: string;
  options: string[];
}

export function FilterChipsField({
  name,
  label,
  options,
}: FilterChipsFieldProps) {
  const { control } = useFormContext();

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-900">{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex flex-wrap gap-2">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out ${
                  field.value === option
                    ? "bg-brand-50 text-brand-700 border-brand-200"
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() =>
                  field.onChange(field.value === option ? null : option)
                }
              >
                {option}
              </button>
            ))}
          </div>
        )}
      />
    </div>
  );
}
