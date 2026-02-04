"use client";

import { useEffect,useMemo } from "react";
import { FormProvider } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { useDynamicOptions } from "../../hooks/useDynamicOptions";
import { useListingWizard } from "../../hooks/useListingWizard";
import { getAllSchemas } from "../../schemas";
import { getApiService } from "../../services";
import type { ServiceType } from "../../types";
import { FieldRenderer } from "../fields/FieldRenderer";

import { WizardLayout } from "./WizardLayout";
import { WizardNavigation } from "./WizardNavigation";

interface WizardFormProps {
  serviceType: ServiceType;
  appUserId?: string | number;
  initialData?: Record<string, unknown>;
  listingId?: number | null;
}

export function WizardForm({
  serviceType,
  appUserId,
  initialData,
  listingId,
}: WizardFormProps) {
  const navigate = useNavigate();
  const apiService = getApiService(serviceType);

  // Initialize wizard with API submit handler
  const wizard = useListingWizard(serviceType, {
    initialData,
    listingId,
    onStepSubmit: async (_step, action, formData, entityId) => {
      if (!action) return;
      return await apiService.executeStepAction(
        action,
        formData,
        entityId,
        appUserId
      );
    },
    onComplete: () => {
      navigate("/listings");
    },
  });

  // Get dynamic options for select fields
  const dynamicOptions = useDynamicOptions();

  const {
    form,
    config,
    currentStep,
    currentStepConfig,
    errors,
    status,
    isSubmitting,
    nextStep,
    prevStep,
    goToStep,
    canGoNext,
    canGoPrev,
    isLastStep,
  } = wizard;

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [form, initialData]);

  // Initialize dynamic options for dependent fields if initial data exists
  useEffect(() => {
    if (initialData) {
      if (initialData.car_brand_id) {
        dynamicOptions.updateSelectedBrand(initialData.car_brand_id as number);
      } else if (initialData.vehicle_brand_id) {
        dynamicOptions.updateSelectedBrand(
          initialData.vehicle_brand_id as number
        );
      }

      if (initialData.country_id) {
        dynamicOptions.updateSelectedCountry(initialData.country_id as number);
      }
    }
  }, [dynamicOptions, initialData]);

  // Watch all form values for sidebar progress display
  const formValues = form.watch();
  const schemas = useMemo(() => getAllSchemas(serviceType), [serviceType]);
  const stepValidation = useMemo(
    () => schemas.map((schema) => schema.safeParse(formValues).success),
    [schemas, formValues]
  );

  // Success state
  if (status === "success") {
    return (
      <WizardLayout
        serviceType={serviceType}
        currentStep={currentStep}
        onStepClick={goToStep}
        formValues={formValues}
        formErrors={form.formState.errors}
        stepValidation={stepValidation}
      >
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Listing Created Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Your listing has been submitted and is now pending review.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => wizard.reset()}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Create Another
            </button>
            <Button
              asChild
              className="px-6 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors"
            >
              <Link to="/listings">View Listings</Link>
            </Button>
          </div>
        </div>
      </WizardLayout>
    );
  }

  return (
    <WizardLayout
      serviceType={serviceType}
      currentStep={currentStep}
      onStepClick={goToStep}
      formValues={formValues}
      formErrors={form.formState.errors}
      stepValidation={stepValidation}
    >
      <FormProvider {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {/* Step Header */}
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span>Step {currentStep + 1}</span>
              <span>of</span>
              <span>{config.steps.length}</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {currentStepConfig.title}
            </h2>
            <p className="text-gray-600 mt-1">
              {currentStepConfig.description}
            </p>
          </div>

          {/* Info Alert */}
          {currentStepConfig.infoAlert && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <svg
                className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-amber-800">
                {currentStepConfig.infoAlert}
              </p>
            </div>
          )}

          {/* Error Alert */}
          {errors.length > 0 && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <svg
                className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-800">
                  Please fix the following errors:
                </p>
                <ul className="text-sm text-red-700 mt-1 list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            {currentStepConfig.fields.map((field) => (
              <div
                key={field.name}
                className={field.span === 2 ? "col-span-2" : "col-span-1"}
              >
                <FieldRenderer
                  field={field}
                  dynamicOptions={{
                    brands: dynamicOptions.brands,
                    models: dynamicOptions.models,
                    countries: dynamicOptions.countries,
                    cities: dynamicOptions.cities,
                    features: dynamicOptions.features,
                  }}
                  onFieldChange={(name, value) => {
                    // Handle dependent field updates
                    if (
                      name === "car_brand_id" ||
                      name === "vehicle_brand_id"
                    ) {
                      dynamicOptions.updateSelectedBrand(
                        value as number | null
                      );
                      if (name === "car_brand_id") {
                        form.setValue("car_model_id", null);
                      } else {
                        form.setValue("car_model_id", null);
                      }
                    } else if (name === "country_id") {
                      dynamicOptions.updateSelectedCountry(
                        value as number | null
                      );
                      form.setValue("city_id", null);
                    }
                  }}
                />
              </div>
            ))}
          </div>

          {/* Navigation */}
          <WizardNavigation
            onPrev={prevStep}
            onNext={nextStep}
            canGoPrev={canGoPrev}
            canGoNext={canGoNext}
            isLastStep={isLastStep}
            isSubmitting={isSubmitting}
          />
        </form>
      </FormProvider>
    </WizardLayout>
  );
}
