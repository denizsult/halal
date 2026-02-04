import type { CompanyType } from "@/types/api";

export interface ModuleEndpoint {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
}

export interface ModuleListingsEndpoints {
  getAll: ModuleEndpoint;
  getById: ModuleEndpoint;
  create: ModuleEndpoint;
  update: ModuleEndpoint;
  delete: ModuleEndpoint;
}

export interface ModuleListingsConfig {
  listings: {
    endpoints: ModuleListingsEndpoints;
  };
}

export type { CompanyType };
