"use client";

import { useEffect, useMemo } from "react";
import { FormProvider, useFormState, useWatch } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { ScrollArea } from "@/components/ui/scroll-area";
import { TopRightModal } from "@/components/ui/top-right-modal";
import { useDynamicOptions } from "@/features/listings-add/hooks/useDynamicOptions";

import { useFilterModal } from "../hooks/useFilterModal";
import type { DynamicFilterModalProps } from "../types";

import { FilterFieldRenderer } from "./FilterFieldRenderer";

export function DynamicFilterModal({
  isOpen,
  onClose,
  serviceType,
  initialValues,
  onApply,
  onClear,
  previewQueryFn,
  previewQueryKey,
}: DynamicFilterModalProps) {
  const { config, form, clearFilters, applyFilters, activeFilterCount } =
    useFilterModal(serviceType, {
      initialValues,
    });

  const { isDirty } = useFormState({ control: form.control });
  const values = useWatch({ control: form.control }) ?? config.defaultValues;
  const queryClient = useQueryClient();

  useEffect(() => {
    form.reset(initialValues ?? config.defaultValues);
  }, [form, initialValues, config.defaultValues, config.type]);

  // Get dynamic options (reusing existing hook)
  const dynamicOptions = useDynamicOptions();

  // Handle dependent field updates
  const handleFieldChange = (name: string, value: unknown) => {
    if (
      name === "brand_id" ||
      name === "car_brand_id" ||
      name === "vehicle_brand_id"
    ) {
      dynamicOptions.updateSelectedBrand(value as number | null);
      // Clear dependent model field
      form.setValue("car_model_id", null);
    } else if (name === "country_id") {
      dynamicOptions.updateSelectedCountry(value as number | null);
      // Clear dependent city field
      form.setValue("city_id", null);
    }
  };

  const handleApply = () => {
    const filters = applyFilters();
    onApply(filters, previewQuery.data);
    onClose();
  };

  const handleClear = () => {
    if (previewQuery.isFetching) {
      queryClient.cancelQueries({ queryKey: previewKey });
    }
    clearFilters();
    onClear?.();
  };

  const previewKey = useMemo(
    () =>
      previewQueryKey
        ? previewQueryKey(values)
        : (["filter-preview", config.type, values] as const),
    [previewQueryKey, values, config.type]
  );

  const previewQuery = useQuery({
    queryKey: previewKey,
    queryFn: ({ signal }) =>
      previewQueryFn
        ? previewQueryFn(values, signal)
        : Promise.resolve({ count: 0 }),
    enabled: isOpen && isDirty && Boolean(previewQueryFn),
    staleTime: 0,
    gcTime: 0,
  });

  const hasPreview = Boolean(previewQueryFn);
  const showApplyCount =
    previewQuery.isSuccess && typeof previewQuery.data?.count === "number";
  const applyLabel = showApplyCount
    ? `Show ${previewQuery.data?.count ?? 0} results`
    : (config.applyLabel ?? "Show results");
  const isApplyDisabled = hasPreview
    ? !isDirty || !previewQuery.isSuccess
    : !isDirty;
  const isClearDisabled = !isDirty && !previewQuery.isFetching;
  const modalTitle =
    activeFilterCount > 0
      ? `${config.displayName} (${activeFilterCount} active)`
      : config.displayName;

  const sections = useMemo(() => {
    if (config.sections?.length) return config.sections;
    if (config.fields?.length) {
      return [{ columns: 2, fields: config.fields }];
    }
    return [];
  }, [config.sections, config.fields]);

  return (
    <TopRightModal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      footerClassName="px-6 py-5"
      secondaryAction={{
        label: config.clearLabel ?? "Clear filters",
        onClick: handleClear,
        disabled: isClearDisabled,
        variant: "outline",
        className:
          "rounded-full bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 font-normal",
      }}
      primaryAction={{
        label: applyLabel,
        onClick: handleApply,
        loading: previewQuery.isFetching,
        disabled: isApplyDisabled,
        className: "rounded-full font-semibold",
      }}
    >
      <FormProvider {...form}>
        <ScrollArea className="h-[400px] px-4 scrollbar-custom">
          <div className="space-y-6 px-2 py-4">
            {sections.map((section, index) => (
              <div
                key={section.id ?? `section-${index}`}
                className={
                  section.columns === 2 ? "grid grid-cols-2 gap-4" : "space-y-6"
                }
              >
                {section.fields.map((field) => (
                  <div
                    key={field.name}
                    className={
                      section.columns === 2
                        ? field.span === 2
                          ? "col-span-2"
                          : "col-span-1"
                        : undefined
                    }
                  >
                    <FilterFieldRenderer
                      field={field}
                      dynamicOptions={{
                        brands: dynamicOptions.brands,
                        models: dynamicOptions.models,
                        countries: dynamicOptions.countries,
                        cities: dynamicOptions.cities,
                        features: dynamicOptions.features,
                      }}
                      onFieldChange={handleFieldChange}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </FormProvider>
    </TopRightModal>
  );
}
