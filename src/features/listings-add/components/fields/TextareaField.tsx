"use client";

import { Controller,useFormContext } from "react-hook-form";

interface TextareaFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
}

export function TextareaField({
  name,
  label,
  placeholder,
  required,
  helpText,
  disabled,
  rows = 4,
  maxLength,
}: TextareaFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative">
            <textarea
              {...field}
              id={name}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              maxLength={maxLength}
              value={field.value ?? ""}
              className={`
                w-full px-4 py-3 rounded-xl border bg-gray-50
                text-sm transition-colors resize-none
                focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                ${error ? "border-red-500" : "border-gray-200"}
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              `}
            />
            {maxLength && (
              <span className="absolute bottom-2 right-3 text-xs text-gray-400">
                {field.value?.length || 0}/{maxLength}
              </span>
            )}
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
