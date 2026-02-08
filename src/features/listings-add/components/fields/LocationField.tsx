import { Controller, useFormContext } from "react-hook-form";

import {
  LocationSelect,
  type LocationValue,
} from "@/components/form/location-select";

interface LocationFieldProps {
  name: string;
  label: string;
  required?: boolean;
  helpText?: string;
  disabled?: boolean;
}

export function LocationField({
  name,
  label,
  required,
  helpText,
  disabled,
}: LocationFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <LocationSelect
          label={label}
          value={field.value as LocationValue}
          onChange={field.onChange}
          required={required}
          hasError={!!error}
          hintText={error || helpText}
          disabled={disabled}
        />
      )}
    />
  );
}
