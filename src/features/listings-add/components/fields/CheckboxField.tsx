"use client";

import { Controller,useFormContext } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";

import type { FieldOption } from "../../types";

interface CheckboxFieldProps {
  name: string;
  label: string;
  options?: FieldOption[];
  required?: boolean;
  helpText?: string;
  disabled?: boolean;
  multiple?: boolean;
}

export function CheckboxField({
  name,
  label,
  options = [],
  required,
  helpText,
  disabled,
  multiple = false,
}: CheckboxFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  // Single checkbox mode
  if (!multiple && options.length === 0) {
    return (
      <div className="flex flex-col gap-1">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <label
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer
                transition-all
                ${
                  field.value
                    ? "bg-teal-50 border-teal-500"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              <Checkbox
                checked={!!field.value}
                disabled={disabled}
                onCheckedChange={(checked) => field.onChange(checked)}
              />
              <span className="text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </span>
            </label>
          )}
        />
        {helpText && !error && (
          <p className="text-xs text-gray-500">{helpText}</p>
        )}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  // Multiple checkboxes (checkbox group)
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field }) => {
          const selectedValues: (string | number)[] = field.value || [];

          const handleToggle = (value: string | number | boolean) => {
            const newValues = selectedValues.includes(value as string | number)
              ? selectedValues.filter((v) => v !== value)
              : [...selectedValues, value];
            field.onChange(newValues);
          };

          return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {options.map((option) => {
                const isSelected = selectedValues.includes(
                  option.value as string | number
                );
                return (
                  <label
                    key={String(option.value)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer
                      transition-all text-sm
                      ${
                        isSelected
                          ? "bg-teal-50 border-teal-500 text-teal-700"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }
                      ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    <Checkbox
                      checked={isSelected}
                      disabled={disabled}
                      onCheckedChange={() => handleToggle(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>
          );
        }}
      />
      {helpText && !error && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
