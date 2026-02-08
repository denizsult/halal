export const LISTING_SERVICE_TYPES = [
  "rent_a_car",
  "hotel",
  "hospital",
  "transfer",
] as const;

export type ListingServiceType = (typeof LISTING_SERVICE_TYPES)[number];
export type ServiceType = ListingServiceType;

export const isListingServiceType = (
  value: string | undefined
): value is ListingServiceType =>
  !!value && (LISTING_SERVICE_TYPES as readonly string[]).includes(value);

// Field types supported by the form system
export type FieldType =
  | "text"
  | "number"
  | "select"
  | "textarea"
  | "radio"
  | "checkbox"
  | "checkboxGroup"
  | "file"
  | "date"
  | "time"
  | "email"
  | "tel"
  | "location"
  | "custom";

// Dynamic options that can be fetched from API
export type DynamicOptionKey =
  | "brands"
  | "models"
  | "countries"
  | "features"
  | "cities"
  | "amenities"
  | "hotelAmenities"
  | "languages"
  | "vehicleFeatures"
  | "serviceAreas";

// Option item for select/radio/checkbox fields
export interface FieldOption {
  value: string | number | boolean;
  label: string;
}

// Single field definition
export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  span?: 1 | 2;
  options?: FieldOption[];
  dynamicOptions?: DynamicOptionKey;
  helpText?: string;
  customComponent?: string;
  dependsOn?: string;
  fileConfig?: {
    multiple?: boolean;
    maxFiles?: number;
    accept?: string;
    existingKey?: string;
    existingLabel?: string;
  };
}

export interface StepSubItem {
  id: string;
  label: string;
  fields?: string[];
}

// Step submit actions
export type StepSubmitAction =
  | "create"
  | "uploadMedia"
  | "updatePricing"
  | "updateCalendar"
  | "updateTerms"
  | "updateService"
  | "updateDriver"
  | "updateExtras"
  | "update"
  | "updateInformations";

// Step definition
export interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  infoAlert?: string;
  customComponent?: string;
  subSteps?: StepSubItem[];
  submitAction?: StepSubmitAction;
  toast?: {
    success?: string;
    error?: string;
  };
}

// API endpoints configuration
export interface ApiEndpoints {
  create: string;
  update: string;
  delete: string;
  read?: string;
  uploadMedia?: string;
  updatePricing?: string;
  updateCalendar?: string;
  updateTerms?: string;
  updateRooms?: string;
  updateAvailability?: string;
  updatePolicies?: string;
  updateContact?: string;
  updateService?: string;
  updateDriver?: string;
  updateExtras?: string;
  updateInformations?: string;
}

// Complete listing config
export interface ListingConfig {
  type: string;
  displayName: string;
  steps: FormStep[];
  apiEndpoints: ApiEndpoints;
  useOverviewBetweenSteps?: boolean;
}

// Wizard status
export type WizardStatus = "idle" | "submitting" | "success" | "error";

// Wizard state
export interface WizardState {
  currentStep: number;
  status: WizardStatus;
  entityId: number | null;
  errors: string[];
}

// Dynamic options state
export interface DynamicOptions {
  brands: FieldOption[];
  models: FieldOption[];
  countries: FieldOption[];
  cities: FieldOption[];
  features: FieldOption[];
  isLoading: boolean;
  error: string | null;
}

// Base form data interface
export interface BaseFormData {
  id?: number;
}
