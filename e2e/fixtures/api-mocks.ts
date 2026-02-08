import type { Page } from "@playwright/test";

export const defaultCommonsData = {
  brands: [
    { id: 1, name: "Toyota", slug: "toyota", logo_url: null },
    { id: 2, name: "Honda", slug: "honda", logo_url: null },
  ],
  models: [
    { id: 10, brand_id: 1, name: "Corolla", slug: "corolla" },
    { id: 11, brand_id: 1, name: "Camry", slug: "camry" },
  ],
  countries: [
    { id: 34, name: "Turkey", code: "TR", phone_code: "+90" },
    { id: 1, name: "United States", code: "US", phone_code: "+1" },
  ],
  cities: [
    { id: 1, country_id: 34, name: "Istanbul", slug: "istanbul" },
    { id: 2, country_id: 34, name: "Ankara", slug: "ankara" },
  ],
  features: [
    { id: 1, name: "Bluetooth", slug: "bluetooth", icon: "bluetooth" },
    { id: 2, name: "GPS", slug: "gps", icon: "gps" },
    { id: 3, name: "Air Conditioning", slug: "ac", icon: "ac" },
  ],
};

export const defaultEmptyListings = {
  data: [],
  meta: {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: 0,
    to: 0,
  },
  links: {
    first: "",
    last: "",
    prev: null,
    next: null,
  },
};

export const setupCommonsMocks = async (
  page: Page,
  data = defaultCommonsData
) => {
  await page.route("**/v1/commons/brands", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: data.brands }),
    });
  });

  await page.route("**/v1/commons/brands/*/models", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: data.models }),
    });
  });

  await page.route("**/v1/commons/countries", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: data.countries }),
    });
  });

  await page.route("**/v1/commons/countries/*/cities", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: data.cities }),
    });
  });

  await page.route("**/v1/commons/features**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: data.features }),
    });
  });
};

type ListingsMocksOptions = {
  basePath: string;
  createdId?: number;
  emptyCollection?: typeof defaultEmptyListings;
};

export const setupListingsMocks = async (
  page: Page,
  { basePath, createdId = 101, emptyCollection = defaultEmptyListings }: ListingsMocksOptions
) => {
  await page.route(`**${basePath}**`, async (route) => {
    const request = route.request();
    const url = request.url();
    const path = new URL(url).pathname;

    if (request.method() === "POST" && url.endsWith("/images")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
      return;
    }

    if (request.method() === "POST" && url.endsWith("/availability")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
      return;
    }

    if (request.method() === "PUT" && url.endsWith("/pricing")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
      return;
    }

    if (request.method() === "PUT" && url.endsWith("/terms")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
      return;
    }

    if (
      request.method() === "POST" &&
      (path === `/api${basePath}` || path === basePath)
    ) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: { id: createdId } }),
      });
      return;
    }

    if (
      request.method() === "GET" &&
      (path === `/api${basePath}` || path === basePath)
    ) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(emptyCollection),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    });
  });
};

export const setupHospitalMocks = async (
  page: Page,
  createdId = 201
) => {
  await page.route("**/api/proxy/api/main/extranet/hospitals/add", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: { id: createdId } }),
    });
  });

  await page.route("**/api/proxy/api/main/extranet/hospitals/update", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    });
  });

  await page.route("**/api/proxy/api/main/extranet/hospitals/media/upload", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    });
  });

  await page.route("**/api/proxy/api/main/extranet/hospitals", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(defaultEmptyListings),
    });
  });
};
