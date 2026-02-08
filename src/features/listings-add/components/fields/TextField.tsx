"use client";

import { Controller, useFormContext } from "react-hook-form";

interface TextFieldProps {
  name: string;
  label: string;
  type?: "text" | "number" | "email" | "tel";
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  disabled?: boolean;
}

export function TextField({
  name,
  label,
  type = "text",
  placeholder,
  required,
  helpText,
  disabled,
}: TextFieldProps) {
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
          <input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            value={field.value ?? ""}
            onChange={(e) => {
              const value =
                type === "number"
                  ? e.target.value === ""
                    ? null
                    : Number(e.target.value)
                  : e.target.value;
              field.onChange(value);
            }}
            className={`
              w-full px-4 py-3 rounded-xl border bg-gray-50
              text-sm transition-colors
              focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
              ${error ? "border-red-500" : "border-gray-200"}
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
          />
        )}
      />
      {helpText && !error && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
