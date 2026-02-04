import { useMemo } from "react";

import { Combobox } from "@/components/ui/combobox";
import { useCities } from "@/features/commons/api/useCities";

type CitySelectProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  countryId?: string | number;
  placeholder?: string;
  required?: boolean;
  hasError?: boolean;
  hintText?: string;
  disabled?: boolean;
};

export function CitySelect({
  label = "City",
  value,
  onChange,
  countryId,
  placeholder = "Select city",
  required,
  hasError,
  hintText,
  disabled,
}: CitySelectProps) {
  const parsedCountryId =
    typeof countryId === "string" ? Number(countryId) : (countryId ?? 0);
  const validCountryId =
    Number.isFinite(parsedCountryId) && parsedCountryId > 0
      ? parsedCountryId
      : 0;

  const {
    data: cities = [],
    isLoading,
    isFetching,
  } = useCities({
    countryId: validCountryId,
    enabled: validCountryId > 0,
  });

  const options = useMemo(
    () =>
      cities.map((city) => ({
        id: city.id,
        name: city.name,
        value: String(city.id),
      })),
    [cities]
  );

  return (
    <Combobox
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      searchPlaceholder="Search city..."
      emptyText="No city found."
      options={options}
      required={required}
      loading={isLoading || isFetching}
      hasError={hasError}
      hintText={hintText}
      disabled={disabled || validCountryId <= 0}
    />
  );
}
