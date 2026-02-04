"use client";

import { useMemo } from "react";
import { Controller,useFormContext } from "react-hook-form";

import { BrandSelect } from "@/components/form/brand-select";
import { CitySelect } from "@/components/form/city-select";
import { CommonSelect } from "@/components/form/common-select";
import { CountrySelect } from "@/components/form/country-select";
import { ModelSelect } from "@/components/form/model-select";

import type { FieldOption } from "../../types";

interface SelectFieldProps {
  name: string;
  label: string;
  options: FieldOption[];
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  disabled?: boolean;
  onChange?: (value: FieldOption["value"] | null) => void;
}

function toNumberOrNull(rawValue: string): number | null {
  if (rawValue === "" || Number.isNaN(Number(rawValue))) return null;
  return Number(rawValue);
}

export function SelectField({
  name,
  label,
  options,
  placeholder,
  required,
  helpText,
  disabled,
  onChange: externalOnChange,
}: SelectFieldProps) {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();
  const error = errors[name]?.message as string | undefined;
  const hintText = error ?? helpText;
  const hasError = !!error;
  const resolvedPlaceholder = placeholder ?? "Select an option";

  const countryId = watch("country_id");
  const carBrandId = watch("car_brand_id");
  const vehicleBrandId = watch("vehicle_brand_id");
  const brandId = carBrandId ?? vehicleBrandId ?? null;

  const valueMap = useMemo(() => {
    const map = new Map<string, FieldOption["value"]>();
    options.forEach((option) => {
      map.set(String(option.value), option.value);
    });
    return map;
  }, [options]);

  const commonOptions = useMemo(
    () =>
      options.map((option) => ({
        id: String(option.value),
        name: option.label,
        value: String(option.value),
      })),
    [options]
  );

  const selectProps = {
    label,
    required,
    hasError,
    hintText,
    disabled,
    placeholder,
  };

  if (name === "country_id") {
    return (
      <div className="flex flex-col gap-1">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <CountrySelect
              {...selectProps}
              value={field.value == null ? "" : String(field.value)}
              onChange={(rawValue) => {
                const value = toNumberOrNull(rawValue);
                field.onChange(value);
                externalOnChange?.(value as FieldOption["value"] | null);
              }}
            />
          )}
        />
      </div>
    );
  }

  if (name === "city_id") {
    return (
      <div className="flex flex-col gap-1">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <CitySelect
              {...selectProps}
              value={field.value == null ? "" : String(field.value)}
              countryId={countryId}
              onChange={(rawValue) => {
                const value = toNumberOrNull(rawValue);
                field.onChange(value);
                externalOnChange?.(value as FieldOption["value"] | null);
              }}
            />
          )}
        />
      </div>
    );
  }

  if (name === "car_brand_id" || name === "vehicle_brand_id") {
    return (
      <div className="flex flex-col gap-1">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <BrandSelect
              {...selectProps}
              value={field.value == null ? "" : String(field.value)}
              onChange={(rawValue) => {
                const value = toNumberOrNull(rawValue);
                field.onChange(value);
                externalOnChange?.(value as FieldOption["value"] | null);
              }}
            />
          )}
        />
      </div>
    );
  }

  if (name === "car_model_id") {
    return (
      <div className="flex flex-col gap-1">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <ModelSelect
              {...selectProps}
              value={field.value == null ? "" : String(field.value)}
              brandId={brandId}
              onChange={(rawValue) => {
                const value = toNumberOrNull(rawValue);
                field.onChange(value);
                externalOnChange?.(value as FieldOption["value"] | null);
              }}
            />
          )}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <CommonSelect
            label={label}
            value={field.value == null ? "" : String(field.value)}
            onChange={(rawValue) => {
              const mappedValue = valueMap.get(rawValue);
              const value = rawValue === "" ? null : (mappedValue ?? rawValue);
              field.onChange(value);
              externalOnChange?.(value as FieldOption["value"] | null);
            }}
            placeholder={resolvedPlaceholder}
            options={commonOptions}
            required={required}
            hasError={hasError}
            hintText={hintText}
            disabled={disabled}
          />
        )}
      />
    </div>
  );
}
