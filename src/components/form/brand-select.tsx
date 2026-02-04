import { useMemo } from "react";

import { Combobox } from "@/components/ui/combobox";
import { useBrands } from "@/features/commons/api/useBrands";

type BrandSelectProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  hasError?: boolean;
  hintText?: string;
  disabled?: boolean;
};

export function BrandSelect({
  label = "Brand",
  value,
  onChange,
  placeholder = "Select brand",
  required,
  hasError,
  hintText,
  disabled,
}: BrandSelectProps) {
  const { data: brands = [], isLoading, isFetching } = useBrands();

  const options = useMemo(
    () =>
      brands.map((brand) => ({
        id: brand.id,
        name: brand.name,
        value: String(brand.id),
      })),
    [brands]
  );

  return (
    <Combobox
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      searchPlaceholder="Search brand..."
      emptyText="No brand found."
      options={options}
      required={required}
      loading={isLoading || isFetching}
      hasError={hasError}
      hintText={hintText}
      disabled={disabled}
    />
  );
}
