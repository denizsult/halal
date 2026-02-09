"use client";

import { FormProvider } from "react-hook-form";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
}: DynamicFilterModalProps) {
  const { config, form, clearFilters, applyFilters, hasActiveFilters, activeFilterCount } =
    useFilterModal(serviceType, {
      initialValues,
      onApply,
    });

  // Get dynamic options (reusing existing hook)
  const dynamicOptions = useDynamicOptions();

  // Handle dependent field updates
  const handleFieldChange = (name: string, value: unknown) => {
    if (name === "brand_id" || name === "car_brand_id" || name === "vehicle_brand_id") {
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
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    clearFilters();
    onClear?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50" />
      <DialogContent
        showCloseButton={false}
        className="fixed top-6 right-6 left-auto translate-x-0 translate-y-0 z-50 w-[92vw] max-w-[520px] bg-white text-gray-900 rounded-3xl shadow-2xl p-0 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">
            {config.displayName}
            {activeFilterCount > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({activeFilterCount} active)
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-100 text-gray-700"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" strokeWidth={2} />
          </button>
        </div>

        {/* Body - Scrollable */}
        <FormProvider {...form}>
          <ScrollArea className="h-[400px] px-4 scrollbar-custom">
            <div className="space-y-6 px-2 py-4">
              <div className="grid grid-cols-2 gap-4">
                {config.fields.map((field) => (
                  <div
                    key={field.name}
                    className={field.span === 2 ? "col-span-2" : "col-span-1"}
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
            </div>
          </ScrollArea>
        </FormProvider>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 bg-white border-t border-gray-100 px-6 py-5 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
          <Button
            onClick={handleClear}
            variant="outline"
            disabled={!hasActiveFilters}
            className="w-full sm:w-auto rounded-full bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 font-normal px-6 py-3 disabled:opacity-50"
          >
            Clear filters
          </Button>
          <Button
            onClick={handleApply}
            className="w-full sm:w-auto rounded-full font-semibold px-6 py-3"
          >
            Apply filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
