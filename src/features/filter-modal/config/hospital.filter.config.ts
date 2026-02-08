import type { FilterConfig, FilterField } from "../types";
import { buildDefaultValues } from "../utils";

const hospitalFields: FilterField[] = [
  {
    name: "country_id",
    label: "Country",
    type: "custom",
    customComponent: "CountrySelect",
    placeholder: "Select country",
    span: 1,
  },
  {
    name: "city_id",
    label: "City",
    type: "custom",
    customComponent: "CitySelect",
    placeholder: "Select city",
    span: 1,
    dependsOn: "country_id",
  },
  {
    name: "specialization",
    label: "Specialization",
    type: "select",
    options: [
      { value: 1, label: "General Medicine" },
      { value: 2, label: "Cardiology" },
      { value: 3, label: "Orthopedics" },
      { value: 4, label: "Oncology" },
      { value: 5, label: "Neurology" },
      { value: 6, label: "Pediatrics" },
      { value: 7, label: "Dermatology" },
      { value: 8, label: "Ophthalmology" },
      { value: 9, label: "Dentistry" },
      { value: 10, label: "Plastic Surgery" },
    ],
    placeholder: "Select specialization",
    span: 2,
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
    name: "sort_by",
    label: "Sort By",
    type: "select",
    options: [
      { value: "created_at", label: "Newest First" },
      { value: "name", label: "Name" },
      { value: "rating", label: "Rating" },
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

export const hospitalFilterConfig: FilterConfig = {
  type: "hospital",
  displayName: "Filter Hospitals",
  fields: hospitalFields,
  defaultValues: buildDefaultValues(hospitalFields, {
    sort_by: "created_at",
    sort_order: "desc",
  }),
};
