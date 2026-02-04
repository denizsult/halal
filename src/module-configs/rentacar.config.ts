import type { ModuleListingsConfig } from "./types";

const base = "/v1/rent-a-car/listings";

export const rentACarConfig: ModuleListingsConfig = {
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
