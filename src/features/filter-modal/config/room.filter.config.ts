import type { FilterConfig, FilterField, FilterSection } from "../types";
import { buildDefaultValues } from "../utils";

import {
  lastUpdatedOptions,
  rankOptions,
  ratingOptions,
} from "./filter-modal.defaults";

const customerNameField: FilterField = {
  type: "text",
  name: "customerName",
  label: "Customer name",
  placeholder: "Search customers",
};

const rankRangeField: FilterField = {
  type: "range",
  name: "rankRange",
  label: "Rank",
  minField: "rankMin",
  maxField: "rankMax",
};

const rankChipsField: FilterField = {
  type: "chips",
  name: "selectedRank",
  label: "Rank options",
  hideLabel: true,
  chipOptions: [...rankOptions],
};

const lastUpdatedField: FilterField = {
  type: "date",
  name: "lastUpdated",
  label: "Last updated",
  placeholder: "Choose date",
  presetField: "lastUpdatedPreset",
  presets: lastUpdatedOptions.map((option) => ({
    label: option,
    value: option,
  })),
};

const ratingField: FilterField = {
  type: "chips",
  name: "rating",
  label: "Rating",
  chipOptions: [...ratingOptions],
};

const roomSections: FilterSection[] = [
  { fields: [customerNameField] },
  {
    fields: [
      {
        type: "chips",
        name: "guests",
        label: "Number of Guests",
        chipOptions: ["1", "2", "3", "4", "5", "6+"],
      },
    ],
  },
  {
    fields: [
      {
        type: "chips",
        name: "roomType",
        label: "Room",
        chipOptions: [
          "Deluxe (24)",
          "Twin (32)",
          "Suite (12)",
          "Superior (12)",
        ],
      },
    ],
  },
  { fields: [rankRangeField, rankChipsField] },
  {
    fields: [
      {
        type: "range",
        name: "priceRange",
        label: "Price",
        minField: "priceMin",
        maxField: "priceMax",
      },
    ],
  },
  { fields: [lastUpdatedField] },
  { fields: [ratingField] },
];

const roomFields = roomSections.flatMap((section) => section.fields);

export const roomFilterConfig: FilterConfig = {
  type: "room",
  displayName: "Filter Rooms",
  fields: roomFields,
  sections: roomSections,
  defaultValues: buildDefaultValues(roomSections),
};
