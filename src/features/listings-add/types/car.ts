import type { BaseFormData } from "./base";

// Car offer for promotions
export interface CarOffer {
  discount_price: number;
  start_date: string;
  end_date: string;
}

// Car pricing configuration
export interface CarPricing {
  low_price: number;
  medium_price: number;
  high_price: number;
  early_booking_discount_percentage: number;
  offers: CarOffer[];
}

// Car calendar/availability configuration
export interface CarCalendar {
  start_date: string | null;
  end_date: string | null;
  is_all_day: boolean;
  unavailable_reason: number | null;
}

// Car term block
export interface CarTerm {
  title: string;
  content: string[];
}

// Complete car form data
export interface CarFormData extends BaseFormData {
  // Step 1: Car Details
  car_brand_id: number | null;
  car_model_id: number | null;
  plate_number: string;
  country_id: number | null;
  year: number | null;
  mileage: number | null;
  fuel_type: number | null;
  transmission_type: number | null;
  number_of_doors: number | null;
  number_of_seats: number | null;
  about: string;
  feature_ids: number[];
  is_professional_owner: boolean | null;
  location_id: {
    place_id: string;
    name: string;
    formatted_address: string;
    latitude: number;
    longitude: number;
  } | null;

  // Step 2: Pricing
  pricing: CarPricing;

  // Step 3: Media
  images: File[];

  // Step 4: Calendar
  calendar: CarCalendar;

  // Step 5: Terms
  terms: CarTerm[];
}

// Initial car form data
export const initialCarFormData: CarFormData = {
  car_brand_id: null,
  car_model_id: null,
  plate_number: "",
  country_id: null,
  year: null,
  mileage: null,
  fuel_type: null,
  transmission_type: null,
  number_of_doors: null,
  number_of_seats: null,
  about: "",
  feature_ids: [],
  is_professional_owner: null,
  location_id: null,
  pricing: {
    low_price: 0,
    medium_price: 0,
    high_price: 0,
    early_booking_discount_percentage: 0,
    offers: [],
  },
  images: [],
  calendar: {
    start_date: null,
    end_date: null,
    is_all_day: false,
    unavailable_reason: null,
  },
  terms: [
    {
      title: "",
      content: [""],
    },
  ],
};

// API DTOs
export interface CreateCarDTO {
  car_model_id: number;
  plate_number: string;
  country_id: number;
  year: number;
  mileage: number;
  fuel_type: number;
  transmission_type: number;
  number_of_doors: number;
  number_of_seats: number;
  number_of_luggage: number;
  is_professional_owner: boolean;
  feature_ids: number[];
  latitude: number;
  longitude: number;
  about: string;
}

export interface CarPricingDTO {
  low_price: number;
  medium_price: number;
  high_price: number;
  early_booking_discount_percentage: number;
  offers: CarOffer[];
}

export interface CarAvailabilityDTO {
  is_all_day: boolean;
  start_date: string;
  end_date: string;
  car_unavailable_reason: number;
}

export interface CarTermDTO {
  title: string;
  content: string[];
}
