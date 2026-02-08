"use client";

import { Controller, useFormContext } from "react-hook-form";

import type { FieldOption } from "../../types";

interface RadioFieldProps {
  name: string;
  label: string;
  options: FieldOption[];
  required?: boolean;
  helpText?: string;
  disabled?: boolean;
  layout?: "horizontal" | "vertical";
}

export function RadioField({
  name,
  label,
  options,
  required,
  helpText,
  disabled,
  layout = "horizontal",
}: RadioFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div
            className={`
              flex gap-3
              ${layout === "vertical" ? "flex-col" : "flex-row flex-wrap"}
            `}
          >
            {options.map((option) => {
              const isSelected = field.value === option.value;
              return (
                <label
                  key={String(option.value)}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer
                    transition-all
                    ${
                      isSelected
                        ? "bg-teal-50 border-teal-500 text-teal-700"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }
                    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  <input
                    type="radio"
                    name={name}
                    value={String(option.value)}
                    checked={isSelected}
                    disabled={disabled}
                    onChange={() => field.onChange(option.value)}
                    className="sr-only"
                  />
                  <span
                    className={`
                      w-4 h-4 rounded-full border-2 flex items-center justify-center
                      ${isSelected ? "border-teal-500" : "border-gray-400"}
                    `}
                  >
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-teal-500" />
                    )}
                  </span>
                  <span className="text-sm">{option.label}</span>
                </label>
              );
            })}
          </div>
        )}
      />
      {helpText && !error && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
