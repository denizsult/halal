import type { FilterConfig, FilterField } from "../types";
import { buildDefaultValues } from "../utils";

const rentACarFields: FilterField[] = [
  {
    name: "country_id",
    label: "Country",
    type: "custom",
    customComponent: "CountrySelect",
    placeholder: "Select country",
    span: 1,
  },
  {
    name: "brand_id",
    label: "Brand",
    type: "custom",
    customComponent: "BrandSelect",
    placeholder: "Select brand",
    span: 1,
  },
  {
    name: "car_model_id",
    label: "Model",
    type: "custom",
    customComponent: "ModelSelect",
    placeholder: "Select model",
    span: 2,
    dependsOn: "brand_id",
  },
  {
    name: "seats",
    label: "Number of Seats",
    type: "chips",
    chipOptions: ["2", "4", "5", "6", "7+"],
    span: 2,
  },
  {
    name: "luggage_capacity",
    label: "Luggage Capacity",
    type: "chips",
    chipOptions: ["1", "2", "3", "4", "5+"],
    span: 2,
  },
  {
    name: "fuel_type",
    label: "Fuel Type",
    type: "select",
    options: [
      { value: 1, label: "Petrol" },
      { value: 2, label: "Diesel" },
      { value: 3, label: "Electric" },
      { value: 4, label: "Hybrid" },
      { value: 5, label: "LPG" },
    ],
    placeholder: "Select fuel type",
    span: 1,
  },
  {
    name: "transmission_type",
    label: "Transmission",
    type: "select",
    options: [
      { value: 1, label: "Automatic" },
      { value: 2, label: "Manual" },
      { value: 3, label: "Semi-Automatic" },
    ],
    placeholder: "Select transmission",
    span: 1,
  },
  {
    name: "price",
    label: "Price Range",
    type: "range",
    minField: "price_min",
    maxField: "price_max",
    span: 2,
  },
  {
    name: "dates",
    label: "Rental Period",
    type: "dateRange",
    minField: "pickup_date",
    maxField: "dropoff_date",
    span: 2,
  },
  {
    name: "sort_by",
    label: "Sort By",
    type: "select",
    options: [
      { value: "created_at", label: "Newest First" },
      { value: "year", label: "Model Year" },
      { value: "price_low", label: "Price: Low to High" },
      { value: "price_high", label: "Price: High to Low" },
    ],
    placeholder: "Sort by",
    span: 1,
  },
  {
    name: "sort_order",
    label: "Sort Order",
    type: "select",
    options: [
      { value: "desc", label: "Descending" },
      { value: "asc", label: "Ascending" },
    ],
    placeholder: "Order",
    span: 1,
  },
];

export const rentACarFilterConfig: FilterConfig = {
  type: "rent_a_car",
  displayName: "Filter Cars",
  fields: rentACarFields,
  defaultValues: buildDefaultValues(rentACarFields, {
    sort_by: "created_at",
    sort_order: "desc",
  }),
};
