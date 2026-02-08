"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { useDynamicOptions } from "../../hooks/useDynamicOptions";
import { useListingWizard } from "../../hooks/useListingWizard";
import { getAllSchemas } from "../../schemas";
import { getApiService } from "../../services";
import { getListingDraftStorageKey } from "../../draft";
import type { ServiceType } from "../../types";
import {
  clearWizardUiState,
  getCompletedSubStepIndex,
  getSubStepIndex,
  hasCompletedSubStepIndex,
  hasSubStepIndex,
  loadWizardUiState,
  persistWizardUiState,
  setCompletedSubStepIndex,
  setSubStepIndex,
  useWizardUiSnapshot,
} from "../../state/wizard-ui.store";
import { FieldRenderer } from "../fields/FieldRenderer";

import { WizardLayout } from "./WizardLayout";
import { WizardNavigation } from "./WizardNavigation";

type DraftStickyBannerProps = {
  visible: boolean;
  isSubmitting: boolean;
  onSave: () => void;
  onDiscard: () => void;
};

const getValueByPath = (
  values: Record<string, unknown>,
  path: string
): unknown =>
  path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, values);

const DraftStickyBanner = ({
  visible,
  isSubmitting,
  onSave,
  onDiscard,
}: DraftStickyBannerProps) => {
  return (
    <div
      className={`sticky top-4 mb-4 z-20 rounded-xl border border-gray-100 bg-white/80 px-4 py-3 backdrop-blur transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-4 opacity-0 pointer-events-none"
      }`}
      aria-hidden={!visible}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          Your progress is saved automatically.
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSave}
            disabled={isSubmitting}
          >
            Save draft
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDiscard}
            disabled={isSubmitting}
          >
            Discard
          </Button>
        </div>
      </div>
    </div>
  );
};

interface WizardFormProps {
  serviceType: ServiceType;
  appUserId?: string | number;
  initialData?: Record<string, unknown>;
  listingId?: number | null;
  persistKey?: string;
  initialStep?: number;
}

export function WizardForm({
  serviceType,
  appUserId,
  initialData,
  listingId,
  persistKey,
  initialStep,
}: WizardFormProps) {
  const navigate = useNavigate();
  const apiService = getApiService(serviceType);
  const storageKey = getListingDraftStorageKey(persistKey);
  const lastStepRef = useRef<number | null>(null);
  const shouldNavigateOverviewRef = useRef(false);
  const uiLoadedRef = useRef(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Initialize wizard with API submit handler
  const wizard = useListingWizard(serviceType, {
    initialData,
    listingId,
    initialStep,
    persistKey,
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
      if (storageKey) {
        clearWizardUiState(storageKey);
      }
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
    saveDraft,
    discardDraft,
    nextStep,
    prevStep,
    goToStep,
    canGoNext,
    canGoPrev,
    isLastStep,
  } = wizard;
  const { isDirty } = form.formState;
  // subscribe to UI store updates once

  useEffect(() => {
    if (!storageKey) return;
    loadWizardUiState(storageKey);
    uiLoadedRef.current = true;
  }, [storageKey]);

  const uiSnapshot = useWizardUiSnapshot();
  useEffect(() => {
    if (!storageKey) return;
    persistWizardUiState(storageKey);
  }, [storageKey, uiSnapshot.subStepById, uiSnapshot.completedSubStepById]);

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [form, initialData]);

  useEffect(() => {
    if (storageKey && !uiLoadedRef.current) return;
    if (currentStepConfig.subSteps?.length) {
      if (!hasSubStepIndex(currentStepConfig.id)) {
        setSubStepIndex(currentStepConfig.id, 0);
      }
      if (!hasCompletedSubStepIndex(currentStepConfig.id)) {
        setCompletedSubStepIndex(currentStepConfig.id, -1);
      }
    }
  }, [currentStepConfig.id, currentStepConfig.subSteps?.length]);

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
  const currentSubSteps = currentStepConfig.subSteps ?? [];
  const currentSubStepIndex = currentSubSteps.length
    ? getSubStepIndex(currentStepConfig.id)
    : 0;
  const currentSubStepFields =
    currentSubSteps[currentSubStepIndex]?.fields ?? [];
  const currentSubStepIsValid = useMemo(() => {
    if (!currentSubSteps.length || currentSubStepFields.length === 0) {
      return true;
    }
    const values = formValues as Record<string, unknown>;
    const errors = form.formState.errors as Record<string, unknown>;
    const minLengths: Record<string, number> = {
      "missionVision.mission": 10,
      "missionVision.vision": 10,
    };
    return currentSubStepFields.every((fieldPath) => {
      const value = getValueByPath(values, fieldPath);
      const requiredLength =
        typeof value === "string" ? (minLengths[fieldPath] ?? 1) : 1;
      const hasValue =
        value !== null &&
        value !== undefined &&
        (typeof value !== "string" || value.trim().length >= requiredLength);
      const hasError = Boolean(getValueByPath(errors, fieldPath));
      return hasValue && !hasError;
    });
  }, [
    currentSubSteps.length,
    currentSubStepFields,
    formValues,
    form.formState.errors,
  ]);

  useEffect(() => {
    if (lastStepRef.current === null) {
      lastStepRef.current = currentStep;
      return;
    }

    if (
      config.useOverviewBetweenSteps &&
      shouldNavigateOverviewRef.current &&
      currentStep > lastStepRef.current
    ) {
      shouldNavigateOverviewRef.current = false;
      lastStepRef.current = currentStep;
      setIsRedirecting(false);
      navigate("/listings/add/overview");
      return;
    }

    lastStepRef.current = currentStep;
  }, [config.useOverviewBetweenSteps, currentStep, navigate]);

  // Success state
  if (status === "success") {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#1D4B4A] text-white">
        <img
          src="/images/backgrounds/success-registration-background-carusel.svg"
          alt=""
          className="pointer-events-none absolute bottom-0 left-0 w-full"
        />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
          <img
            src="/images/logo/logo.svg"
            alt="HalalHolidayCheck"
            className="h-8 w-auto mb-12"
          />
          <img
            src="/images/emojis/gratz.svg"
            alt=""
            className="h-16 w-16 mb-6"
          />
          <h2 className="text-2xl md:text-3xl font-semibold">
            Your {config.displayName} Has Been Successfully Listed!
          </h2>
          <p className="mt-3 max-w-xl text-sm md:text-base text-[#D1E3E2]">
            Your property is now live and visible to travelers. Get ready to
            receive bookings and welcome your first guests!
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#1D4B4A] hover:bg-gray-100"
            >
              Back to home
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-[#E8B040] px-6 py-3 text-sm font-semibold text-[#1D4B4A] hover:bg-[#d9a236]"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
      </div>
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
        <DraftStickyBanner
          visible={isDirty}
          isSubmitting={isSubmitting}
          onSave={saveDraft}
          onDiscard={() => {
            discardDraft();
            if (storageKey) {
              clearWizardUiState(storageKey);
            }
          }}
        />

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
          {currentStepConfig.customComponent ? (
            <FieldRenderer
              field={{
                name: currentStepConfig.id,
                label: currentStepConfig.title,
                type: "custom",
                customComponent: currentStepConfig.customComponent,
                span: 2,
              }}
              dynamicOptions={{
                brands: dynamicOptions.brands,
                models: dynamicOptions.models,
                countries: dynamicOptions.countries,
                cities: dynamicOptions.cities,
                features: dynamicOptions.features,
              }}
              onFieldChange={(name, value) => {
                // Handle dependent field updates
                if (name === "car_brand_id" || name === "vehicle_brand_id") {
                  dynamicOptions.updateSelectedBrand(value as number | null);
                  if (name === "car_brand_id") {
                    form.setValue("car_model_id", null);
                  } else {
                    form.setValue("car_model_id", null);
                  }
                } else if (name === "country_id") {
                  dynamicOptions.updateSelectedCountry(value as number | null);
                  form.setValue("city_id", null);
                }
              }}
            />
          ) : (
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
          )}

          {/* Sticky Navigation */}
          <div className="sticky bottom-0 z-20 border-t border-gray-200 bg-white/90 px-2 py-4 backdrop-blur">
            <WizardNavigation
              onPrev={async () => {
                if (currentSubSteps.length > 0) {
                  if (currentSubStepIndex > 0) {
                    setSubStepIndex(
                      currentStepConfig.id,
                      currentSubStepIndex - 1
                    );
                    return;
                  }
                }
                prevStep();
              }}
              onNext={async () => {
                if (currentSubSteps.length > 0) {
                  const fieldsToValidate = currentSubStepFields;
                  if (fieldsToValidate.length > 0) {
                    const values = form.getValues();
                    let isValid = true;
                    const minLengths: Record<string, number> = {
                      "missionVision.mission": 10,
                      "missionVision.vision": 10,
                    };
                    fieldsToValidate.forEach((fieldPath) => {
                      const value = getValueByPath(
                        values as Record<string, unknown>,
                        fieldPath
                      );
                      const requiredLength =
                        typeof value === "string"
                          ? (minLengths[fieldPath] ?? 1)
                          : 1;
                      const hasValue =
                        value !== null &&
                        value !== undefined &&
                        (typeof value !== "string" ||
                          value.trim().length >= requiredLength);
                      if (!hasValue) {
                        isValid = false;
                        form.setError(fieldPath as never, {
                          type: "manual",
                          message:
                            requiredLength > 1
                              ? `Minimum ${requiredLength} characters required`
                              : "This field is required",
                        });
                      } else {
                        form.clearErrors(fieldPath as never);
                      }
                    });
                    if (!isValid) return;
                  }
                  setCompletedSubStepIndex(
                    currentStepConfig.id,
                    Math.max(
                      getCompletedSubStepIndex(currentStepConfig.id),
                      currentSubStepIndex
                    )
                  );
                  if (currentSubStepIndex < currentSubSteps.length - 1) {
                    setSubStepIndex(
                      currentStepConfig.id,
                      currentSubStepIndex + 1
                    );
                    return;
                  }
                }
                if (config.useOverviewBetweenSteps && !isLastStep) {
                  shouldNavigateOverviewRef.current = true;
                  setIsRedirecting(true);
                }
                await nextStep();
              }}
              canGoPrev={
                currentSubSteps.length > 0 ? currentSubStepIndex > 0 : canGoPrev
              }
              canGoNext={canGoNext && currentSubStepIsValid}
              isLastStep={isLastStep}
              isSubmitting={isSubmitting}
            />
          </div>
        </form>
      </FormProvider>
    </WizardLayout>
  );
}
