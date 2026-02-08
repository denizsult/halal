import { expect, test } from "@playwright/test";

import {
  demoHospitalUser,
  setupHospitalListingsMocks,
} from "./fixtures/listings-add-hospital";

test("hospital listing add flow completes", async ({ page }) => {
  await page.addInitScript((user) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", "e2e-token");
    localStorage.setItem("refreshToken", "e2e-refresh");
  }, demoHospitalUser);

  await setupHospitalListingsMocks(page);

  await page.goto("/listings/add");
  await page.waitForLoadState("networkidle");

  const main = page.getByRole("main");
  await expect(
    main.getByRole("heading", { name: "Hospital details" })
  ).toBeVisible();

  await main.getByLabel("Headquarter name").fill("City Hospital");
  await main.getByLabel("Headquarter address").fill("Istanbul, Turkey");
  await main.getByRole("button", { name: "Next" }).click();

  await expect(
    main.getByRole("heading", { name: "Mission & Vision" })
  ).toBeVisible();
  await main
    .getByLabel("Mission")
    .fill("Provide world-class care with compassion.");
  await main
    .getByLabel("Vision")
    .fill(
      "To be the most trusted medical partner through innovation and patient-first service."
    );
  await main.getByRole("button", { name: "Next" }).click();
  await main.getByRole("button", { name: "Next" }).click();
  await main.getByRole("button", { name: "Next" }).click();
  await main.getByRole("button", { name: "Next" }).click();

  await expect(page).toHaveURL(/listings\/add\/overview/);

  await page.getByRole("button", { name: "Edit" }).nth(1).click();
  await expect(main.getByRole("heading", { name: "Our doctors" })).toBeVisible();

  await main.getByRole("button", { name: "Add doctor" }).click();
  await main.getByLabel("Address *").selectOption("Dr.");
  await main.getByLabel("Full name *").fill("Dr. Emma Johnson");
  await main.getByLabel("Rating *").fill("4.9");
  await main.getByLabel("About doctor *").fill("Experienced neurologist.");
  await main.getByRole("button", { name: "Neurological Consultation" }).click();

  const doctorPhotoInput = main.locator('input[type="file"]').nth(0);
  await doctorPhotoInput.setInputFiles({
    name: "doctor.jpg",
    mimeType: "image/jpeg",
    buffer: Buffer.from("doctor-photo"),
  });

  const doctorLicenseInput = main.locator('input[type="file"]').nth(1);
  await doctorLicenseInput.setInputFiles({
    name: "license.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("license"),
  });

  await main.getByRole("button", { name: "Next" }).click();

  await expect(page).toHaveURL(/listings\/add\/overview/);
  await page.getByRole("button", { name: "Edit" }).nth(2).click();

  await expect(main.getByRole("heading", { name: "Services" })).toBeVisible();
  await main.getByRole("button", { name: "Add service" }).click();
  await main.getByLabel("Title *").fill("Neurology");
  await main.getByLabel("About service *").fill("Comprehensive neurology care.");
  await main.getByRole("button", { name: "MRI & CT Scans" }).click();
  await main.getByRole("button", { name: "Dr. Emma Johnson, MD" }).click();

  const servicePhotoInput = main.locator('input[type="file"]').nth(0);
  await servicePhotoInput.setInputFiles({
    name: "service.jpg",
    mimeType: "image/jpeg",
    buffer: Buffer.from("service-photo"),
  });
  const serviceCoverInput = main.locator('input[type="file"]').nth(1);
  await serviceCoverInput.setInputFiles({
    name: "service-cover.jpg",
    mimeType: "image/jpeg",
    buffer: Buffer.from("service-cover"),
  });

  await main.getByRole("button", { name: "Next" }).click();

  await expect(page).toHaveURL(/listings\/add\/overview/);
  await page.getByRole("button", { name: "Edit" }).nth(3).click();

  await expect(
    main.getByRole("heading", { name: "Upload Media" })
  ).toBeVisible();

  const mediaInput = main.locator('input[type="file"]');
  await mediaInput.setInputFiles([
    {
      name: "photo1.jpg",
      mimeType: "image/jpeg",
      buffer: Buffer.from("photo1"),
    },
    {
      name: "photo2.jpg",
      mimeType: "image/jpeg",
      buffer: Buffer.from("photo2"),
    },
    {
      name: "photo3.jpg",
      mimeType: "image/jpeg",
      buffer: Buffer.from("photo3"),
    },
    {
      name: "photo4.jpg",
      mimeType: "image/jpeg",
      buffer: Buffer.from("photo4"),
    },
    {
      name: "photo5.jpg",
      mimeType: "image/jpeg",
      buffer: Buffer.from("photo5"),
    },
  ]);

  await main.getByRole("button", { name: "Complete" }).click();

  await expect(
    page.getByRole("heading", {
      name: "Your Hospital Has Been Successfully Listed!",
    })
  ).toBeVisible();
});
