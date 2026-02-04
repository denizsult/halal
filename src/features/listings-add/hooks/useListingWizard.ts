"use client";

import { useCallback, useMemo,useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { getListingConfig } from "../config";
import { getValidationSchema } from "../schemas";
import type {
  FormStep,
  ListingConfig,
  ServiceType,
  WizardState,
  WizardStatus,
} from "../types";

export interface UseListingWizardReturn {
  // Configuration
  config: ListingConfig;
  currentStep: number;
  totalSteps: number;
  currentStepConfig: FormStep;

  // Status
  status: WizardStatus;
  entityId: number | null;
  errors: string[];
  isSubmitting: boolean;

  // Form instance
  form: UseFormReturn<Record<string, unknown>>;

  // Actions
  nextStep: () => Promise<void>;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
  setEntityId: (id: number) => void;
  setErrors: (errors: string[]) => void;
  clearErrors: () => void;

  // Computed flags
  isFirstStep: boolean;
  isLastStep: boolean;
  canGoNext: boolean;
  canGoPrev: boolean;
}

interface UseListingWizardOptions {
  listingId?: number | null;
  initialData?: Record<string, unknown>;
  onStepSubmit?: (
    step: number,
    action: string | undefined,
    formData: Record<string, unknown>,
    entityId: number | null
  ) => Promise<{ id?: number } | void>;
  onComplete?: (entityId: number | null) => void;
}

export function useListingWizard(
  serviceType: ServiceType,
  options: UseListingWizardOptions = {}
): UseListingWizardReturn {
  const { onStepSubmit, onComplete } = options;

  // Get config for this service type
  const config = useMemo(() => getListingConfig(serviceType), [serviceType]);

  // Wizard state
  const [wizardState, setWizardState] = useState<WizardState>({
    currentStep: 0,
    status: "idle",
    entityId: options.listingId || null,
    errors: [],
  });

  // Current step configuration
  const currentStepConfig = config.steps[wizardState.currentStep];

  // Get schema for current step
  const currentSchema = useMemo(
    () => getValidationSchema(serviceType, wizardState.currentStep),
    [serviceType, wizardState.currentStep]
  );

  // Form instance with Zod validation (schema is dynamic per step; cast for resolver compatibility)
  const form = useForm<Record<string, unknown>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(currentSchema as any),
    mode: "onChange",
    defaultValues: options.initialData || {},
  });

  // Set entity ID (e.g., after creation)
  const setEntityId = useCallback((id: number) => {
    setWizardState((s) => ({ ...s, entityId: id }));
  }, []);

  // Set errors
  const setErrors = useCallback((errors: string[]) => {
    setWizardState((s) => ({ ...s, errors, status: "error" }));
  }, []);

  // Clear errors
  const clearErrors = useCallback(() => {
    setWizardState((s) => ({ ...s, errors: [], status: "idle" }));
  }, []);

  // Navigate to next step
  const nextStep = useCallback(async () => {
    setWizardState((s) => ({ ...s, status: "submitting", errors: [] }));

    try {
      // Validate current step
      const isValid = await form.trigger();
      if (!isValid) {
        setWizardState((s) => ({ ...s, status: "error" }));
        return;
      }

      const formData = form.getValues();
      const { submitAction } = currentStepConfig;

      // Execute step action if provided
      if (onStepSubmit) {
        const result = await onStepSubmit(
          wizardState.currentStep,
          submitAction,
          formData,
          wizardState.entityId
        );

        if (submitAction && currentStepConfig.toast?.success) {
          toast.success(currentStepConfig.toast.success);
        }

        // If this was a create action, store the entity ID
        if (
          submitAction === "create" &&
          result &&
          typeof result === "object" &&
          "id" in result &&
          result.id
        ) {
          setWizardState((s) => ({ ...s, entityId: result.id as number }));
        }
      }

      // Move to next step or complete
      if (wizardState.currentStep < config.steps.length - 1) {
        setWizardState((s) => ({
          ...s,
          currentStep: s.currentStep + 1,
          status: "idle",
        }));
      } else {
        setWizardState((s) => ({ ...s, status: "success" }));
        onComplete?.(wizardState.entityId);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      if (currentStepConfig.submitAction && currentStepConfig.toast?.error) {
        toast.error(currentStepConfig.toast.error);
      }
      setWizardState((s) => ({
        ...s,
        status: "error",
        errors: [errorMessage],
      }));
    }
  }, [
    form,
    currentStepConfig,
    onStepSubmit,
    wizardState.currentStep,
    wizardState.entityId,
    config.steps.length,
    onComplete,
  ]);

  // Navigate to previous step
  const prevStep = useCallback(() => {
    if (wizardState.currentStep > 0) {
      setWizardState((s) => ({
        ...s,
        currentStep: s.currentStep - 1,
        status: "idle",
        errors: [],
      }));
    }
  }, [wizardState.currentStep]);

  // Navigate to specific step (only backwards allowed)
  const goToStep = useCallback(
    (step: number) => {
      if (
        step >= 0 &&
        step < config.steps.length &&
        step <= wizardState.currentStep
      ) {
        setWizardState((s) => ({
          ...s,
          currentStep: step,
          status: "idle",
          errors: [],
        }));
      }
    },
    [config.steps.length, wizardState.currentStep]
  );

  // Reset wizard to initial state
  const reset = useCallback(() => {
    form.reset();
    setWizardState({
      currentStep: 0,
      status: "idle",
      entityId: null,
      errors: [],
    });
  }, [form]);

  return {
    // Configuration
    config,
    currentStep: wizardState.currentStep,
    totalSteps: config.steps.length,
    currentStepConfig,

    // Status
    status: wizardState.status,
    entityId: wizardState.entityId,
    errors: wizardState.errors,
    isSubmitting: wizardState.status === "submitting",

    // Form
    form,

    // Actions
    nextStep,
    prevStep,
    goToStep,
    reset,
    setEntityId,
    setErrors,
    clearErrors,

    // Computed flags
    isFirstStep: wizardState.currentStep === 0,
    isLastStep: wizardState.currentStep === config.steps.length - 1,
    canGoNext: wizardState.status !== "submitting",
    canGoPrev:
      wizardState.currentStep > 0 && wizardState.status !== "submitting",
  };
}
