import { test, expect, type Page } from "@playwright/test";

const demoUser = {
  id: 1,
  name: "Demo User",
  email: "demo@hhc.test",
  phone: "+1 555 000 0000",
  email_verified_at: null,
  is_active: true,
  company: {
    id: 10,
    name: "Demo Rooms Co",
    slug: "demo-rooms",
    type: "room",
    type_label: "Rooms",
    logo_url: null,
    phone: "+1 555 000 0000",
    email: "rooms@hhc.test",
    address: "123 Test Ave",
    city: "Test City",
    country: "Testland",
    tax_number: "TAX-000",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
};

type MockOptions = {
  previewDelayMs?: number;
  previewCount?: number;
};

const baseListingResponse = {
  data: [
    {
      id: 101,
      name: "Deluxe Suite",
      type: "Suite",
      price: 220,
      status: "Active",
    },
  ],
  meta: {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 1,
    from: 1,
    to: 1,
  },
  links: {
    first: "",
    last: "",
    prev: null,
    next: null,
  },
};

const buildPreviewResponse = (count: number) => ({
  data: [],
  meta: {
    current_page: 1,
    last_page: 1,
    per_page: 1,
    total: count,
    from: 1,
    to: 1,
  },
  links: {
    first: "",
    last: "",
    prev: null,
    next: null,
  },
});

const setupApiMocks = async (page: Page, options: MockOptions = {}) => {
  const { previewDelayMs = 0, previewCount = 2 } = options;

  await page.route("**/v1/commons/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [] }),
    });
  });

  await page.route("**/v1/room/listings**", async (route) => {
    const url = new URL(route.request().url());
    const isPreview = url.searchParams.get("limit") === "1";

    if (isPreview) {
      if (previewDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, previewDelayMs));
      }
      try {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(buildPreviewResponse(previewCount)),
        });
      } catch {
        // Ignore failures when the request is canceled by the client.
      }
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(baseListingResponse),
    });
  });
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript((user) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", "test-access-token");
    localStorage.setItem("refreshToken", "test-refresh-token");
  }, demoUser);
});

test("Filters button launches filter modal", async ({ page }) => {
  await setupApiMocks(page);
  await page.goto("/listings");

  await page.getByRole("button", { name: "Filter" }).click();
  await expect(page.getByRole("heading", { name: "Filter Rooms" })).toBeVisible();
});

test("Filter form change triggers loading and shows preview count", async ({ page }) => {
  await setupApiMocks(page, { previewDelayMs: 800, previewCount: 2 });
  await page.goto("/listings");

  await page.getByRole("button", { name: "Filter" }).click();

  const customerName = page.getByLabel("Customer name");
  const applyButton = page.getByRole("button", { name: /Show/i });

  await customerName.fill("Jane");
  await expect(applyButton.locator("svg.animate-spin")).toBeVisible();

  await expect(applyButton).toHaveText(/Show 2 results/);
});

test("Clear button cancels active preview request", async ({ page }) => {
  await setupApiMocks(page, { previewDelayMs: 5000, previewCount: 2 });
  await page.goto("/listings");

  await page.getByRole("button", { name: "Filter" }).click();

  const customerName = page.getByLabel("Customer name");
  const clearButton = page.getByRole("button", { name: /Clear filters/i });

  const failedRequest = page.waitForEvent("requestfailed", (request) => {
    const url = new URL(request.url());
    return (
      url.pathname.endsWith("/v1/room/listings") &&
      url.searchParams.get("limit") === "1"
    );
  });

  await customerName.fill("Canceled");
  await expect(clearButton).toBeEnabled();
  await clearButton.click();

  const failure = (await failedRequest).failure();
  expect(failure?.errorText ?? "").toContain("ERR_ABORTED");
});

test("Clear button resets form and is disabled when pristine", async ({ page }) => {
  await setupApiMocks(page);
  await page.goto("/listings");

  await page.getByRole("button", { name: "Filter" }).click();

  const customerName = page.getByLabel("Customer name");
  const clearButton = page.getByRole("button", { name: /Clear filters/i });

  await expect(clearButton).toBeDisabled();

  await customerName.fill("Reset me");
  await expect(clearButton).toBeEnabled();

  await clearButton.click();

  await expect(customerName).toHaveValue("");
  await expect(clearButton).toBeDisabled();
});
