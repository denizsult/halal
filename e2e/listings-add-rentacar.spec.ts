import { expect, test } from "@playwright/test";

import { demoUser, setupRentACarMocks } from "./fixtures/listings-add-rentacar";

test("rent-a-car listing add flow completes", async ({ page }) => {
  await page.addInitScript((user) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", "e2e-token");
    localStorage.setItem("refreshToken", "e2e-refresh");
  }, demoUser);

  await setupRentACarMocks(page);

  await page.goto("/listings/add");
  await page.waitForLoadState("networkidle");

  const main = page.getByRole("main");
  await expect(main.getByRole("heading", { name: "Car Details" })).toBeVisible();

  const selectComboboxOption = async (label: string, option: string) => {
    const field = main.getByText(label).locator("..");
    const combo = field.getByRole("combobox");
    await expect(combo).toBeEnabled();
    await combo.click();
    await page.getByRole("option", { name: option }).click();
  };

  await selectComboboxOption("Brand", "Toyota");
  await selectComboboxOption("Model", "Corolla");
  await main.getByLabel("Plate Number").fill("34 ABC 123");
  await selectComboboxOption("Country of Registration", "Turkey");
  await main.getByLabel("Model Year").fill("2022");
  await main.getByLabel("Mileage (km)").fill("45000");

  const fuelField = main.getByText("Fuel Type").locator("..");
  await fuelField.getByRole("combobox").click();
  await page.getByRole("option", { name: "Petrol" }).click();

  const transmissionField = main.getByText("Transmission").locator("..");
  await transmissionField.getByText("Automatic").click();

  const luggageField = main.getByText("Number of Luggage").locator("..");
  await luggageField.getByText("2").click();

  const doorsField = main.getByText("Number of Doors").locator("..");
  await doorsField.getByText("4").click();

  const seatsField = main.getByText("Number of Seats").locator("..");
  await seatsField.getByText("5").click();

  await expect(main.getByText("Bluetooth")).toBeVisible();
  const featuresField = main.getByText("Features").locator("..");
  await featuresField.getByText("Bluetooth").click();

  const ownerField = main.getByText("Ownership Type").locator("..");
  await ownerField.getByText("Private Owner").click();

  await main
    .getByLabel("About the Car")
    .fill("Clean, reliable, and smooth.");

  await main.getByPlaceholder("Search for a location...").fill("Istanbul");
  await main.getByRole("button", { name: "Istanbul Airport (IST)" }).click();

  await main.getByRole("button", { name: "Next" }).click();

  await expect(main.getByRole("heading", { name: "Pricing" })).toBeVisible();

  const plusButtons = main.getByRole("button", { name: "+" });
  await plusButtons.nth(0).click();
  await plusButtons.nth(1).click();
  await plusButtons.nth(2).click();

  await main.getByRole("button", { name: "Next" }).click();

  await expect(main.getByRole("heading", { name: "Upload Media" })).toBeVisible();

  const fileInput = main.locator('input[type="file"]');
  await fileInput.setInputFiles({
    name: "car.jpg",
    mimeType: "image/jpeg",
    buffer: Buffer.from("fake-image"),
  });

  await main.getByRole("button", { name: "Next" }).click();

  await expect(
    main.getByRole("heading", { name: "Availability" })
  ).toBeVisible();

  const pickDateButtons = main.getByRole("button", { name: "Pick a date" });
  await pickDateButtons.first().click();
  const calendar = page.locator('[data-slot="calendar"]');
  const dayButtons = calendar.locator("button[data-day]");
  await dayButtons.nth(10).click();

  await pickDateButtons.last().click();
  const endCalendar = page.locator('[data-slot="calendar"]');
  const endDayButtons = endCalendar.locator("button[data-day]");
  await endDayButtons.nth(12).click();

  await main.getByRole("button", { name: "Next" }).click();

  await expect(
    main.getByRole("heading", { name: "Rental Terms" })
  ).toBeVisible();

  await main
    .getByPlaceholder("Term title (e.g., Driver Requirements)")
    .fill("Driver Requirements");
  await main
    .getByPlaceholder("Point 1")
    .fill("Valid driver license required.");

  await main.getByRole("button", { name: "Complete" }).click();

  await expect(page).toHaveURL(/listings$/);
});
