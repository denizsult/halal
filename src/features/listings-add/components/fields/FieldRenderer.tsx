"use client";

import type { ComponentType } from "react";
import { lazy, Suspense } from "react";
import { Controller, useFormContext } from "react-hook-form";

import type { DynamicOptionKey, FieldOption, FormField } from "../../types";

import { CheckboxField } from "./CheckboxField";
import { FileField } from "./FileField";
import { LocationField } from "./LocationField";
import { RadioField } from "./RadioField";
import { SelectField } from "./SelectField";
import { TextareaField } from "./TextareaField";
import { TextField } from "./TextField";

// Custom component registry - lazy loaded for performance
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customComponentRegistry: Record<string, ComponentType<any>> = {
  CarPricing: lazy(() => import("../custom/car/PricingStep")),
  CarCalendar: lazy(() => import("../custom/car/CalendarStep")),
  CarTerms: lazy(() => import("../custom/car/TermsStep")),
  HospitalMedia: lazy(() => import("../custom/hospital/MediaStep")),
  HospitalLocations: lazy(() => import("../custom/hospital/LocationsStep")),
  HospitalMissionVision: lazy(
    () => import("../custom/hospital/MissionVisionStep")
  ),
  HospitalStatistics: lazy(() => import("../custom/hospital/StatisticsStep")),
  HospitalCertificates: lazy(
    () => import("../custom/hospital/CertificatesStep")
  ),
  HospitalAwards: lazy(() => import("../custom/hospital/AwardsStep")),
  HospitalDetails: lazy(() => import("../custom/hospital/HospitalDetailsStep")),
  HospitalDoctors: lazy(() => import("../custom/hospital/DoctorsStep")),
  HospitalServices: lazy(() => import("../custom/hospital/ServicesStep")),
  TransferBranches: lazy(() => import("../custom/transfer/BranchesStep")),
  TransferExpertises: lazy(() => import("../custom/transfer/ExpertisesStep")),
  TransferPricing: lazy(() => import("../custom/transfer/PricingStep")),
};

interface FieldRendererProps {
  field: FormField;
  dynamicOptions?: Partial<Record<DynamicOptionKey, FieldOption[]>>;
  onFieldChange?: (name: string, value: unknown) => void;
}

// Loading placeholder for lazy-loaded components
function FieldLoading() {
  return <div className="animate-pulse bg-gray-100 rounded-xl h-32" />;
}

export function FieldRenderer({
  field,
  dynamicOptions = {},
  onFieldChange,
}: FieldRendererProps) {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();
  const error = errors[field.name]?.message as string | undefined;
  const isDependentDisabled = field.dependsOn ? !watch(field.dependsOn) : false;

  // Get options - either static from config or dynamic from API
  const options: FieldOption[] = field.dynamicOptions
    ? (dynamicOptions[field.dynamicOptions] ?? [])
    : (field.options ?? []);

  // Handle custom components
  if (field.type === "custom" && field.customComponent) {
    const CustomComponent = customComponentRegistry[field.customComponent];

    if (!CustomComponent) {
      console.warn(`Custom component not found: ${field.customComponent}`);
      return (
        <div className="text-red-500 text-sm">
          Component not found: {field.customComponent}
        </div>
      );
    }

    // Get nested errors for custom components
    const fieldErrors = errors[field.name] as
      | Record<string, { message?: string }>
      | undefined;

    return (
      <Suspense fallback={<FieldLoading />}>
        <Controller
          name={field.name}
          control={control}
          render={({ field: formField }) => (
            <CustomComponent
              value={formField.value}
              onChange={(value: unknown) => {
                formField.onChange(value);
                onFieldChange?.(field.name, value);
              }}
              error={error}
              fieldErrors={fieldErrors}
            />
          )}
        />
      </Suspense>
    );
  }

  // Common props for all fields
  const commonProps = {
    name: field.name,
    label: field.label,
    placeholder: field.placeholder,
    required: field.required,
    helpText: field.helpText,
  };

  // Render based on field type
  switch (field.type) {
    case "text":
    case "email":
    case "tel":
      return <TextField {...commonProps} type={field.type} />;

    case "number":
      return <TextField {...commonProps} type="number" />;

    case "select":
      return (
        <SelectField
          {...commonProps}
          options={options}
          disabled={isDependentDisabled}
          onChange={(value) => onFieldChange?.(field.name, value)}
        />
      );

    case "radio":
      return <RadioField {...commonProps} options={options} />;

    case "checkbox":
      return <CheckboxField {...commonProps} />;

    case "checkboxGroup":
      return <CheckboxField {...commonProps} options={options} multiple />;

    case "textarea":
      return <TextareaField {...commonProps} />;

    case "file":
      return (
        <FileField
          {...commonProps}
          multiple={field.fileConfig?.multiple}
          maxFiles={field.fileConfig?.maxFiles}
          accept={field.fileConfig?.accept}
          existingKey={field.fileConfig?.existingKey}
          existingLabel={field.fileConfig?.existingLabel}
        />
      );

    case "location":
      return <LocationField {...commonProps} />;

    case "date":
      return (
        <TextField {...commonProps} type="text" placeholder="YYYY-MM-DD" />
      );

    case "time":
      return <TextField {...commonProps} type="text" placeholder="HH:MM" />;

    default:
      console.warn(`Unknown field type: ${field.type}`);
      return <TextField {...commonProps} />;
  }
}
