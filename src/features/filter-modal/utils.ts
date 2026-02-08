import type { FilterField, FilterSection } from "./types";

type FilterDefaults = Record<string, unknown>;

const getFieldDefaults = (field: FilterField): FilterDefaults => {
  switch (field.type) {
    case "text":
    case "number":
    case "time":
      return { [field.name]: "" };
    case "select":
      return { [field.name]: null };
    case "date": {
      const values: FilterDefaults = { [field.name]: null };
      if (field.presets?.length && field.presetField) {
        values[field.presetField] = "";
      }
      return values;
    }
    case "dateRange":
      return {
        ...(field.minField ? { [field.minField]: null } : {}),
        ...(field.maxField ? { [field.maxField]: null } : {}),
      };
    case "range":
      return {
        ...(field.minField ? { [field.minField]: "" } : {}),
        ...(field.maxField ? { [field.maxField]: "" } : {}),
      };
    case "chips":
      return { [field.name]: null };
    case "custom":
      return { [field.name]: null };
    default:
      return {};
  }
};

export const buildDefaultValues = (
  fieldsOrSections: FilterField[] | FilterSection[],
  overrides: FilterDefaults = {}
): FilterDefaults => {
  const fields = Array.isArray(fieldsOrSections)
    ? fieldsOrSections.flatMap((item) =>
        "fields" in item ? item.fields : [item]
      )
    : [];

  const values = fields.reduce<FilterDefaults>((acc, field) => {
    Object.assign(acc, getFieldDefaults(field));
    return acc;
  }, {});

  return { ...values, ...overrides };
};
