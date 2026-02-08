"use client";

import { Controller, useFormContext } from "react-hook-form";

import { BrandSelect } from "@/components/form/brand-select";
import { CitySelect } from "@/components/form/city-select";
import { CountrySelect } from "@/components/form/country-select";
import { ModelSelect } from "@/components/form/model-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  DynamicOptionKey,
  FieldOption,
} from "@/features/listings-add/types";

import type { FilterCustomComponent, FilterField } from "../types";

import { FilterChipsField } from "./FilterChipsField";
import { FilterDateField } from "./FilterDateField";
import { FilterDateRangeField } from "./FilterDateRangeField";
import { FilterRangeField } from "./FilterRangeField";

interface FilterFieldRendererProps {
  field: FilterField;
  dynamicOptions?: Partial<Record<DynamicOptionKey, FieldOption[]>>;
  onFieldChange?: (name: string, value: unknown) => void;
}

// Custom component registry
type CustomComponentRenderer = (props: {
  field: FilterField;
  control: ReturnType<typeof useFormContext>["control"];
  watch: ReturnType<typeof useFormContext>["watch"];
  onFieldChange?: (name: string, value: unknown) => void;
  isDependentDisabled: boolean;
}) => React.ReactNode;

const customComponentRegistry: Record<
  FilterCustomComponent,
  CustomComponentRenderer
> = {
  BrandSelect: ({ field, control, onFieldChange }) => (
    <Controller
      name={field.name}
      control={control}
      render={({ field: formField }) => (
        <BrandSelect
          label={field.label}
          value={formField.value?.toString() ?? ""}
          onChange={(value) => {
            formField.onChange(value ? Number(value) : null);
            onFieldChange?.(field.name, value ? Number(value) : null);
          }}
          placeholder={field.placeholder}
        />
      )}
    />
  ),
  ModelSelect: ({
    field,
    control,
    watch,
    onFieldChange,
    isDependentDisabled,
  }) => (
    <Controller
      name={field.name}
      control={control}
      render={({ field: formField }) => (
        <ModelSelect
          label={field.label}
          value={formField.value?.toString() ?? ""}
          onChange={(value) => {
            formField.onChange(value ? Number(value) : null);
            onFieldChange?.(field.name, value ? Number(value) : null);
          }}
          brandId={field.dependsOn ? watch(field.dependsOn) : undefined}
          placeholder={field.placeholder}
          disabled={isDependentDisabled}
        />
      )}
    />
  ),
  CountrySelect: ({ field, control, onFieldChange }) => (
    <Controller
      name={field.name}
      control={control}
      render={({ field: formField }) => (
        <CountrySelect
          label={field.label}
          value={formField.value?.toString() ?? ""}
          onChange={(value) => {
            formField.onChange(value ? Number(value) : null);
            onFieldChange?.(field.name, value ? Number(value) : null);
          }}
          placeholder={field.placeholder}
        />
      )}
    />
  ),
  CitySelect: ({
    field,
    control,
    watch,
    onFieldChange,
    isDependentDisabled,
  }) => (
    <Controller
      name={field.name}
      control={control}
      render={({ field: formField }) => (
        <CitySelect
          label={field.label}
          value={formField.value?.toString() ?? ""}
          onChange={(value) => {
            formField.onChange(value ? Number(value) : null);
            onFieldChange?.(field.name, value ? Number(value) : null);
          }}
          countryId={field.dependsOn ? watch(field.dependsOn) : undefined}
          placeholder={field.placeholder}
          disabled={isDependentDisabled}
        />
      )}
    />
  ),
};

export function FilterFieldRenderer({
  field,
  dynamicOptions = {},
  onFieldChange,
}: FilterFieldRendererProps) {
  const { control, watch, register } = useFormContext();
  const isDependentDisabled = field.dependsOn ? !watch(field.dependsOn) : false;

  // Handle custom components first
  if (field.type === "custom" && field.customComponent) {
    const renderer = customComponentRegistry[field.customComponent];
    if (renderer) {
      return (
        <>
          {renderer({
            field,
            control,
            watch,
            onFieldChange,
            isDependentDisabled,
          })}
        </>
      );
    }
    console.warn(`Unknown custom component: ${field.customComponent}`);
  }

  // Get options - either static from config or dynamic from API
  const options: FieldOption[] = field.dynamicOptions
    ? (dynamicOptions[field.dynamicOptions] ?? [])
    : (field.options ?? []);

  switch (field.type) {
    case "select":
      return (
        <div className="space-y-2">
          {!field.hideLabel ? (
            <Label
              htmlFor={field.name}
              className="text-sm font-medium text-gray-900"
            >
              {field.label}
            </Label>
          ) : null}
          <Controller
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <Select
                value={formField.value?.toString() ?? ""}
                onValueChange={(value) => {
                  const parsedValue =
                    value === ""
                      ? null
                      : isNaN(Number(value))
                        ? value
                        : Number(value);
                  formField.onChange(parsedValue);
                  onFieldChange?.(field.name, parsedValue);
                }}
                disabled={isDependentDisabled}
              >
                <SelectTrigger
                  id={field.name}
                  className="w-full bg-white text-gray-900 border-gray-200 rounded-xl data-[placeholder]:text-gray-400 focus-visible:border-brand-300 focus-visible:ring-brand-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SelectValue placeholder={field.placeholder ?? "Select"} />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900 border-gray-200">
                  {options.map((option) => (
                    <SelectItem
                      key={String(option.value)}
                      value={String(option.value)}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {field.helpText && (
            <p className="text-xs text-gray-500">{field.helpText}</p>
          )}
        </div>
      );

    case "range":
      return (
        <FilterRangeField
          label={field.label}
          minField={field.minField!}
          maxField={field.maxField!}
        />
      );

    case "dateRange":
      return (
        <FilterDateRangeField
          label={field.label}
          startField={field.minField!}
          endField={field.maxField!}
        />
      );

    case "date":
      return (
        <FilterDateField
          name={field.name}
          label={field.label}
          placeholder={field.placeholder}
          presets={field.presets}
          presetField={field.presetField}
        />
      );

    case "chips":
      return (
        <FilterChipsField
          name={field.name}
          label={field.label}
          options={field.chipOptions!}
        />
      );

    case "text":
    case "time":
      return (
        <div className="space-y-2">
          {!field.hideLabel ? (
            <Label
              htmlFor={field.name}
              className="text-sm font-medium text-gray-900"
            >
              {field.label}
            </Label>
          ) : null}
          <Input
            id={field.name}
            type={field.type === "time" ? "time" : "text"}
            placeholder={field.placeholder}
            {...register(field.name)}
            className="w-full bg-white text-gray-900 border-gray-200 rounded-xl placeholder:text-gray-400 focus-visible:border-brand-300 focus-visible:ring-brand-100 transition-all ease-in"
          />
          {field.helpText && (
            <p className="text-xs text-gray-500">{field.helpText}</p>
          )}
        </div>
      );

    case "number":
      return (
        <div className="space-y-2">
          {!field.hideLabel ? (
            <Label
              htmlFor={field.name}
              className="text-sm font-medium text-gray-900"
            >
              {field.label}
            </Label>
          ) : null}
          <Input
            id={field.name}
            type="number"
            placeholder={field.placeholder}
            {...register(field.name)}
            className="w-full bg-white text-gray-900 border-gray-200 rounded-xl placeholder:text-gray-400 focus-visible:border-brand-300 focus-visible:ring-brand-100 transition-all ease-in"
          />
          {field.helpText && (
            <p className="text-xs text-gray-500">{field.helpText}</p>
          )}
        </div>
      );

    default:
      console.warn(`Unknown filter field type: ${field.type}`);
      return (
        <div className="space-y-2">
          {!field.hideLabel ? (
            <Label
              htmlFor={field.name}
              className="text-sm font-medium text-gray-900"
            >
              {field.label}
            </Label>
          ) : null}
          <Input
            id={field.name}
            type="text"
            placeholder={field.placeholder}
            {...register(field.name)}
            className="w-full bg-white text-gray-900 border-gray-200 rounded-xl placeholder:text-gray-400 focus-visible:border-brand-300 focus-visible:ring-brand-100 transition-all ease-in"
          />
        </div>
      );
  }
}
