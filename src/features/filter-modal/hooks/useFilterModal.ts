"use client";

import { useCallback, useMemo } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";

import type { CompanyType } from "@/types/api";

import { getFilterConfig } from "../config";
import type { FilterConfig, FilterState } from "../types";

export interface UseFilterModalReturn {
  // Configuration
  config: FilterConfig;

  // Form instance
  form: UseFormReturn<FilterState>;

  // Actions
  clearFilters: () => void;
  applyFilters: () => FilterState;
  resetToDefaults: () => void;

  // State
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

interface UseFilterModalOptions {
  initialValues?: FilterState;
  onApply?: (filters: FilterState) => void;
}

export function useFilterModal(
  companyType: CompanyType,
  options: UseFilterModalOptions = {}
): UseFilterModalReturn {
  const { initialValues, onApply } = options;

  // Get config for this company type
  const config = useMemo(() => getFilterConfig(companyType), [companyType]);

  // Form instance
  const form = useForm<FilterState>({
    defaultValues: initialValues ?? config.defaultValues,
  });

  // Watch all form values
  const formValues = form.watch();

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    const defaults = config.defaultValues;

    for (const [key, value] of Object.entries(formValues)) {
      const defaultValue = defaults[key];
      if (value !== defaultValue && value !== null && value !== "") {
        count++;
      }
    }
    return count;
  }, [formValues, config.defaultValues]);

  const hasActiveFilters = activeFilterCount > 0;

  // Clear all filters
  const clearFilters = useCallback(() => {
    form.reset(config.defaultValues);
  }, [form, config.defaultValues]);

  // Apply filters
  const applyFilters = useCallback(() => {
    const values = form.getValues();
    onApply?.(values);
    return values;
  }, [form, onApply]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    form.reset(config.defaultValues);
  }, [form, config.defaultValues]);

  return {
    config,
    form,
    clearFilters,
    applyFilters,
    resetToDefaults,
    hasActiveFilters,
    activeFilterCount,
  };
}
