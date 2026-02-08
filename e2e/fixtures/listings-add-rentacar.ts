import type { Page } from "@playwright/test";

import {
  defaultCommonsData,
  setupCommonsMocks,
  setupListingsMocks,
} from "./api-mocks";

export const demoUser = {
  id: 1,
  name: "Demo User",
  email: "demo@example.com",
  phone: "000",
  email_verified_at: null,
  is_active: true,
  company: {
    id: 10,
    name: "Demo Rent A Car",
    slug: "demo-rentacar",
    type: "rent_a_car",
    type_label: "Rent a Car",
    logo_url: null,
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const setupRentACarMocks = async (page: Page) => {
  await setupCommonsMocks(page, defaultCommonsData);
  await setupListingsMocks(page, {
    basePath: "/v1/rent-a-car/listings",
    createdId: 101,
  });
};
