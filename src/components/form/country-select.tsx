import { useMemo } from "react";

import { Combobox } from "@/components/ui/combobox";
import { useCountries } from "@/features/commons/api/useCountries";

type CountrySelectProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  hasError?: boolean;
  hintText?: string;
  disabled?: boolean;
};

export function CountrySelect({
  label = "Country",
  value,
  onChange,
  placeholder = "Select country",
  required,
  hasError,
  hintText,
  disabled,
}: CountrySelectProps) {
  const { data: countries = [], isLoading, isFetching } = useCountries();

  const options = useMemo(
    () =>
      countries.map((country) => ({
        id: country.id,
        name: country.name,
        value: String(country.id),
      })),
    [countries]
  );

  return (
    <Combobox
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      searchPlaceholder="Search country..."
      emptyText="No country found."
      options={options}
      required={required}
      loading={isLoading || isFetching}
      hasError={hasError}
      hintText={hintText}
      disabled={disabled}
    />
  );
}
