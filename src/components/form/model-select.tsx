import { useMemo } from "react";

import { Combobox } from "@/components/ui/combobox";
import { useModels } from "@/features/commons/api/useModels";

type ModelSelectProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  brandId?: string | number;
  placeholder?: string;
  required?: boolean;
  hasError?: boolean;
  hintText?: string;
  disabled?: boolean;
};

export function ModelSelect({
  label = "Model",
  value,
  onChange,
  brandId,
  placeholder = "Select model",
  required,
  hasError,
  hintText,
  disabled,
}: ModelSelectProps) {
  const parsedBrandId =
    typeof brandId === "string" ? Number(brandId) : (brandId ?? 0);
  const validBrandId =
    Number.isFinite(parsedBrandId) && parsedBrandId > 0 ? parsedBrandId : 0;

  const {
    data: models = [],
    isLoading,
    isFetching,
  } = useModels({
    brandId: validBrandId,
    enabled: validBrandId > 0,
  });

  const options = useMemo(
    () =>
      models.map((model) => ({
        id: model.id,
        name: model.name,
        value: String(model.id),
      })),
    [models]
  );

  return (
    <Combobox
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      searchPlaceholder="Search model..."
      emptyText="No model found."
      options={options}
      required={required}
      loading={isLoading || isFetching}
      hasError={hasError}
      hintText={hintText}
      disabled={disabled || validBrandId <= 0}
    />
  );
}
