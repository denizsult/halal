import type { FilterConfig, FilterField } from "../types";
import { buildDefaultValues } from "../utils";

const flightFields: FilterField[] = [
  {
    name: "sort_by",
    label: "Sort By",
    type: "select",
    options: [
      { value: "created_at", label: "Newest First" },
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

export const flightFilterConfig: FilterConfig = {
  type: "flight",
  displayName: "Filter Flights",
  fields: flightFields,
  defaultValues: buildDefaultValues(flightFields, {
    sort_by: "created_at",
    sort_order: "desc",
  }),
};
