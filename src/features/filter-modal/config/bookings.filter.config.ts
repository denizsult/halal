import type { FilterConfig, FilterField, FilterSection } from "../types";
import { buildDefaultValues } from "../utils";

import {
  lastUpdatedOptions,
  rankOptions,
  ratingOptions,
  toOptions,
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

const bookingSections: FilterSection[] = [
  { fields: [customerNameField] },
  { fields: [rankRangeField, rankChipsField] },
  {
    fields: [
      {
        type: "text",
        name: "destination",
        label: "Destination",
        placeholder: "Choose destination",
      },
    ],
  },
  {
    columns: 2,
    fields: [
      {
        type: "select",
        name: "duration",
        label: "Duration",
        options: toOptions(["1 day", "3 days", "7 days", "14 days"]),
      },
      {
        type: "select",
        name: "status",
        label: "Status",
        options: toOptions(["Pending", "Confirmed", "Cancelled"]),
      },
    ],
  },
  {
    columns: 2,
    fields: [
      {
        type: "select",
        name: "type",
        label: "Type",
        options: toOptions(["Standard", "Premium", "VIP"]),
      },
      {
        type: "select",
        name: "languages",
        label: "Languages",
        options: toOptions(["English", "Spanish", "French", "Arabic"]),
      },
    ],
  },
  {
    fields: [
      {
        type: "date",
        name: "startDate",
        label: "Start Date/Time",
        placeholder: "Choose date",
      },
    ],
  },
  {
    fields: [
      {
        type: "date",
        name: "endDate",
        label: "End Date/Time",
        placeholder: "Choose date",
      },
    ],
  },
  {
    fields: [
      { type: "time", name: "time", label: "Time", placeholder: "Choose time" },
    ],
  },
  {
    fields: [
      {
        type: "range",
        name: "pricePerPerson",
        label: "Price/Person",
        minField: "pricePersonMin",
        maxField: "pricePersonMax",
      },
    ],
  },
  {
    fields: [
      {
        type: "range",
        name: "totalPayments",
        label: "Total Payments",
        minField: "totalPaymentsMin",
        maxField: "totalPaymentsMax",
      },
    ],
  },
  {
    fields: [
      {
        type: "chips",
        name: "bookedCount",
        label: "Number of Booked",
        chipOptions: ["1", "2", "3", "4+"],
      },
    ],
  },
  { fields: [lastUpdatedField] },
  { fields: [ratingField] },
];

const bookingFields = bookingSections.flatMap((section) => section.fields);

export const bookingsFilterConfig: FilterConfig = {
  type: "bookings",
  displayName: "Filter Bookings",
  fields: bookingFields,
  sections: bookingSections,
  defaultValues: buildDefaultValues(bookingSections),
};
