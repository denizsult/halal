import type { QueryKey } from "@tanstack/react-query";

import type {
  DynamicOptionKey,
  FieldOption,
  FieldType,
} from "@/features/listings-add/types";
import type { CompanyType } from "@/types/api";

// Filter-specific field types (extends FieldType)
export type FilterFieldType =
  | FieldType
  | "range"
  | "dateRange"
  | "chips"
  | "time";

// Custom component names supported in filter modal
export type FilterCustomComponent =
  | "BrandSelect"
  | "ModelSelect"
  | "CountrySelect"
  | "CitySelect";

// Filter field definition
export interface FilterField {
  name: string;
  label: string;
  type: FilterFieldType;
  placeholder?: string;
  span?: 1 | 2;
  hideLabel?: boolean;
  description?: string;
  options?: FieldOption[];
  dynamicOptions?: DynamicOptionKey;
  dependsOn?: string;
  helpText?: string;
  // Filter-specific props
  minField?: string; // For range/dateRange type: name of min field
  maxField?: string; // For range/dateRange type: name of max field
  chipOptions?: string[]; // For chips type
  // Date presets
  presets?: Array<{ label: string; value: string }>;
  presetField?: string;
  // Custom component support
  customComponent?: FilterCustomComponent;
}

export interface FilterSection {
  id?: string;
  columns?: 1 | 2;
  fields: FilterField[];
}

// Filter config for a service type
export interface FilterConfig {
  type: string;
  displayName: string;
  fields: FilterField[];
  sections?: FilterSection[];
  defaultValues: Record<string, unknown>;
  applyLabel?: string;
  clearLabel?: string;
}

// Filter state type (generic)
export type FilterState = Record<string, unknown>;

// Filter modal props
export interface DynamicFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: CompanyType;
  initialValues?: FilterState;
  onApply: (filters: FilterState, preview?: FilterPreviewResult) => void;
  onClear?: () => void;
  previewQueryFn?: FilterPreviewQueryFn;
  previewQueryKey?: FilterPreviewQueryKey;
}

export interface FilterPreviewResult<TData = unknown> {
  count: number;
  data?: TData;
}

export type FilterPreviewQueryFn<TData = unknown> = (
  values: FilterState,
  signal?: AbortSignal
) => Promise<FilterPreviewResult<TData>>;

export type FilterPreviewQueryKey = (values: FilterState) => QueryKey;

// Re-export commonly used types
export type { CompanyType, DynamicOptionKey, FieldOption };
