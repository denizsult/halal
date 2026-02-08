/**
 * API types aligned with OpenAPI Rental Listing API spec.
 */

// --- Common ---
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ValidationErrorResponse {
  message: string;
  errors: Record<string, string[]>;
}

// --- Auth: Request DTOs ---
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  company_name: string;
  company_type: CompanyType;
  phone?: string;
  company_phone?: string;
  company_email?: string;
  company_address?: string;
  company_city?: string;
  company_country?: string;
  tax_number?: string;
}

export interface UserRegisterRequest {
  name: string;
  surname: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  date_of_birth: string;
}

export type CompanyType =
  | "rent_a_car"
  | "hospital"
  | "hotel"
  | "flight"
  | "transfer"
  | "tour"
  | "event"
  | "activity"
  | "health"
  | "room";

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  password: string;
  password_confirmation: string;
}

// --- Auth: Response & Resources ---
export interface AuthResponseData {
  user: UserResource;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: AuthResponseData;
}

export interface UserResource {
  id: number;
  name: string;
  email: string;
  phone?: string;
  profile_photo_url?: string | null;
  email_verified_at: string | null;
  is_active: boolean;
  company: CompanyResource;
  created_at: string;
  updated_at: string;
}

export interface CompanyResource {
  id: number;
  name: string;
  slug: string;
  type: CompanyType;
  type_label: string;
  logo_url: string | null;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  tax_number?: string;
  about?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// --- Profile ---
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
}

export interface UpdateCompanyRequest {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  tax_number?: string;
  about?: string;
}

export interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  booking_updates: boolean;
}

// --- Locations ---
export interface LocationPrediction {
  place_id: string;
  description: string;
  main_text: string;
  secondary_text: string;
}

export interface PlaceDetails {
  name: string;
  formatted_address: string;
  latitude: number;
  longitude: number;
}

// --- Commons ---
export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
}

export interface CarModel {
  id: number;
  brand_id: number;
  name: string;
  slug: string;
  brand?: Pick<Brand, "id" | "name" | "slug">;
}

export interface Feature {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

export interface Country {
  id: number;
  name: string;
  code: string;
  phone_code: string;
}

export interface City {
  id: number;
  country_id: number;
  name: string;
  slug: string;
  country?: Pick<Country, "id" | "name" | "code">;
}

// --- Rent a Car: Listings ---
export type ListingStatus = "active" | "inactive" | "pending";

export interface RentACarListingsParams {
  status?: ListingStatus;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
}

export interface RentACarListingResource {
  id: number;
  plate_number: string;
  year: number;
  mileage: number;
  fuel_type: number;
  fuel_type_label: string;
  transmission_type: number;
  transmission_type_label: string;
  doors: number;
  seats: number;
  luggage_capacity: number;
  is_professional_owner: boolean;
  about: string;
  status: string;
  status_label: string;
  full_name: string;
  main_image_url: string | null;
  location?: { latitude: number; longitude: number };
  brand: { id: number; name: string; logo_url: string | null };
  model: { id: number; name: string };
  country: Country;
  features: Feature[];
  pricing?: RentACarPricingResource;
  images: RentACarImageResource[];
  created_at: string;
  updated_at: string;
}

/** Matches backend RentACarPricingResource (listing detail & list). */
export interface RentACarPricingResource {
  id: number;
  low_price: number;
  medium_price: number;
  high_price: number;
  early_booking_discount: number | null;
}

export interface RentACarImageResource {
  id: number;
  file_name: string;
  file_url: string;
  mime_type: string;
  file_size: number;
  is_main: boolean;
  sort_order: number;
}

/** Generic paginated listing response; used by all modules. */
export interface ListingCollection<T = unknown> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface RentACarListingCollection extends ListingCollection<RentACarListingResource> {}

export interface CreateRentACarListingRequest {
  car_model_id: number;
  country_id: number;
  plate_number: string;
  year: number;
  mileage: number;
  fuel_type: 1 | 2 | 3 | 4 | 5;
  transmission_type: 1 | 2 | 3;
  doors?: number;
  seats?: number;
  luggage_capacity?: number;
  latitude?: number;
  longitude?: number;
  is_professional_owner?: boolean;
  about?: string;
  feature_ids?: number[];
}

export interface UpdateRentACarListingRequest extends Partial<CreateRentACarListingRequest> {}

export interface UpdatePricingRequest {
  low_price?: number;
  medium_price?: number;
  high_price?: number;
  early_booking_discount?: number;
  offers?: Array<{
    discount_price: number;
    start_date: string;
    end_date: string;
  }>;
}

export interface AddAvailabilityRequest {
  type: "available" | "unavailable";
  start_date: string;
  end_date: string;
  note?: string;
}

export interface UpdateTermsRequest {
  terms: Array<{ key: string; value: string }>;
}
