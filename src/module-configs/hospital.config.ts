import type { ModuleListingsConfig } from "./types";

const base = "/v1/hospital/listings";

export const hospitalConfig: ModuleListingsConfig = {
  listings: {
    endpoints: {
      getAll: { url: base, method: "GET" },
      getById: { url: `${base}/:id`, method: "GET" },
      create: { url: base, method: "POST" },
      update: { url: `${base}/:id`, method: "PUT" },
      delete: { url: `${base}/:id`, method: "DELETE" },
    },
  },
};
