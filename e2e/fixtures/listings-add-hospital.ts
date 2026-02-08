import type { Page } from "@playwright/test";

import { setupHospitalMocks } from "./api-mocks";

export const demoHospitalUser = {
  id: 2,
  name: "Demo Hospital User",
  email: "hospital@example.com",
  phone: "000",
  email_verified_at: null,
  is_active: true,
  company: {
    id: 20,
    name: "Demo Hospital",
    slug: "demo-hospital",
    type: "hospital",
    type_label: "Hospital",
    logo_url: null,
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const setupHospitalListingsMocks = async (page: Page) => {
  await setupHospitalMocks(page, 201);
};
