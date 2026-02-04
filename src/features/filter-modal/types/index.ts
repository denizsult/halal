import type {
  DynamicOptionKey,
  FieldOption,
  FieldType,
} from "@/features/listings-add/types";
import type { CompanyType } from "@/types/api";

// Filter-specific field types (extends FieldType)
export type FilterFieldType = FieldType | "range" | "dateRange" | "chips";

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
  options?: FieldOption[];
  dynamicOptions?: DynamicOptionKey;
  dependsOn?: string;
  helpText?: string;
  // Filter-specific props
  minField?: string; // For range/dateRange type: name of min field
  maxField?: string; // For range/dateRange type: name of max field
  chipOptions?: string[]; // For chips type
  // Custom component support
  customComponent?: FilterCustomComponent;
}

// Filter config for a service type
export interface FilterConfig {
  type: string;
  displayName: string;
  fields: FilterField[];
  defaultValues: Record<string, unknown>;
}

// Filter state type (generic)
export type FilterState = Record<string, unknown>;

// Filter modal props
export interface DynamicFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: CompanyType;
  initialValues?: FilterState;
  onApply: (filters: FilterState) => void;
  onClear?: () => void;
}

// Re-export commonly used types
export type { CompanyType, DynamicOptionKey, FieldOption };
