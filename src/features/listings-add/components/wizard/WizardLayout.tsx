"use client";

import type { ReactNode } from "react";
import type { FieldErrors } from "react-hook-form";
import { Link } from "react-router-dom";

import { getListingConfig } from "../../config";
import {
  getCompletedSubStepIndex,
  getSubStepIndex,
  setSubStepIndex,
  useWizardUiSnapshot,
} from "../../state/wizard-ui.store";
import type { FormStep, ServiceType } from "../../types";

interface WizardLayoutProps {
  children: ReactNode;
  serviceType: ServiceType;
  currentStep: number;
  onStepClick: (step: number) => void;
  formValues?: Record<string, unknown>;
  formErrors?: FieldErrors<Record<string, unknown>>;
  stepValidation?: boolean[];
  sidebarContent?: ReactNode;
}

// Check if a field has a valid value
function isFieldCompleted(value: unknown, hasError: boolean): boolean {
  if (hasError) return false;
  if (value === null || value === undefined) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  if (Array.isArray(value) && value.length === 0) return false;
  return true;
}

// Check icon for completed items
function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM11.7071 6.70711C12.0976 6.31658 12.0976 5.68342 11.7071 5.29289C11.3166 4.90237 10.6834 4.90237 10.2929 5.29289L7 8.58579L5.70711 7.29289C5.31658 6.90237 4.68342 6.90237 4.29289 7.29289C3.90237 7.68342 3.90237 8.31658 4.29289 8.70711L6.29289 10.7071C6.68342 11.0976 7.31658 11.0976 7.70711 10.7071L11.7071 6.70711Z"
      />
    </svg>
  );
}

// Step circle component
function StepCircle({
  stepNumber,
  isActive,
  isCompleted,
}: {
  stepNumber: number;
  isActive: boolean;
  isCompleted: boolean;
}) {
  if (isActive) {
    return (
      <div className="relative w-10 h-10 shrink-0">
        <div className="absolute inset-0 rounded-full bg-[#5D8B8A]" />
        <div className="absolute inset-[25%] rounded-full bg-white" />
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="w-10 h-10 shrink-0 rounded-full bg-[#5D8B8A] flex items-center justify-center">
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-10 h-10 shrink-0 rounded-full bg-[#266462] flex items-center justify-center">
      <span className="text-[#93B2B1] text-xl font-semibold">{stepNumber}</span>
    </div>
  );
}

// Progress line between steps
function ProgressLine({ isCompleted }: { isCompleted: boolean }) {
  return (
    <div className="w-[3px] flex-1 min-h-[20px]">
      <div
        className={`w-full h-full ${isCompleted ? "bg-[#5D8B8A]" : "bg-[#266462]"}`}
      />
    </div>
  );
}

// Pending circle icon for incomplete fields
function PendingIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

// Single step item
function StepItem({
  step,
  stepIndex,
  currentStep,
  totalSteps,
  onStepClick,
  formValues = {},
  formErrors,
  stepValidation,
}: {
  step: FormStep;
  stepIndex: number;
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
  formValues?: Record<string, unknown>;
  formErrors?: FieldErrors<Record<string, unknown>>;
  stepValidation?: boolean;
}) {
  useWizardUiSnapshot();
  const isActive = stepIndex === currentStep;
  const isCompleted = Boolean(stepValidation) || stepIndex < currentStep;
  const isClickable = isActive || Boolean(stepValidation);
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;

  const hasSubSteps = Boolean(step.subSteps?.length);
  const activeSubStepIndex = getSubStepIndex(step.id);
  const maxCompletedSubStepIndex = getCompletedSubStepIndex(step.id);
  const requiredFields = step.fields.filter((field) => field.required);
  const progressFields =
    requiredFields.length > 0 ? requiredFields : step.fields;
  const completedFields = progressFields.filter((field) => {
    const fieldError = formErrors
      ? (formErrors as Record<string, unknown>)[field.name]
      : undefined;
    return isFieldCompleted(formValues[field.name], Boolean(fieldError));
  }).length;
  const totalFields = progressFields.length;

  return (
    <div className="flex gap-6">
      {/* Left side: Circle + Lines */}
      <div className="flex flex-col items-center">
        {!isFirst && <ProgressLine isCompleted={isCompleted} />}
        <StepCircle
          stepNumber={stepIndex + 1}
          isActive={isActive}
          isCompleted={isCompleted}
        />
        {!isLast && <ProgressLine isCompleted={isCompleted} />}
      </div>

      {/* Right side: Content */}
      <div className="flex-1 py-2">
        <button
          type="button"
          onClick={() => isClickable && onStepClick(stepIndex)}
          disabled={!isClickable}
          className={`w-full text-left transition-all ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}`}
        >
          <p
            className={`text-xs font-medium tracking-wide mb-1.5 ${isActive ? "text-[#E4E4E4]" : "text-[#93B2B1]"}`}
          >
            Step {stepIndex + 1}
            {isActive && totalFields > 0 && (
              <span className="ml-2 text-[#5D8B8A]">
                ({completedFields}/{totalFields})
              </span>
            )}
          </p>

          <h3
            className={`text-base font-semibold tracking-wide mb-0.5 ${isActive ? "text-white" : "text-[#93B2B1]"}`}
          >
            {step.title}
          </h3>

          <p
            className={`text-[10px] font-medium tracking-wide leading-relaxed ${isActive ? "text-[#E4E4E4]" : "text-[#93B2B1]"}`}
          >
            {step.description}
          </p>
        </button>

        {/* Sub-items for active step - shows completion status based on form values */}
        {isActive && hasSubSteps && (
          <div className="mt-3 space-y-2">
            {step.subSteps?.map((subStep, subIndex) => {
              const completed = subIndex <= maxCompletedSubStepIndex;
              const canNavigate =
                subIndex === 0 || subIndex <= maxCompletedSubStepIndex;
              return (
                <button
                  key={subStep.id}
                  type="button"
                  onClick={() =>
                    canNavigate && setSubStepIndex(step.id, subIndex)
                  }
                  disabled={!canNavigate}
                  className={`flex items-center gap-2 text-left ${
                    canNavigate
                      ? subIndex === activeSubStepIndex
                        ? "opacity-100"
                        : "opacity-70 hover:opacity-100"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  {completed ? (
                    <CheckIcon className="w-4 h-4 text-white" />
                  ) : (
                    <PendingIcon className="w-4 h-4 text-[#5D8B8A]" />
                  )}
                  <span
                    className={`text-xs font-medium ${completed ? "text-white" : "text-[#5D8B8A]"}`}
                  >
                    {subStep.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {isActive && !hasSubSteps && step.fields.length > 0 && (
          <div className="mt-3 space-y-2">
            {step.fields.slice(0, 5).map((field) => {
              const fieldError = formErrors
                ? (formErrors as Record<string, unknown>)[field.name]
                : undefined;
              const fieldCompleted = isFieldCompleted(
                formValues[field.name],
                Boolean(fieldError)
              );
              return (
                <div key={field.name} className="flex items-center gap-2">
                  {fieldCompleted ? (
                    <CheckIcon className="w-4 h-4 text-white" />
                  ) : (
                    <PendingIcon className="w-4 h-4 text-[#5D8B8A]" />
                  )}
                  <span
                    className={`text-xs font-medium ${fieldCompleted ? "text-white" : "text-[#5D8B8A]"}`}
                  >
                    {field.label}
                  </span>
                </div>
              );
            })}
            {step.fields.length > 5 && (
              <p className="text-xs text-[#5D8B8A] ml-6">
                +{step.fields.length - 5} more fields
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Help section
function HelpSection() {
  return (
    <div className="relative rounded-xl overflow-hidden border-2 border-[#266462]">
      <div className="absolute inset-0 bg-[#1D4B4A]" />
      <div className="relative p-4">
        {/* Chat icon */}
        <div className="w-10 h-10 mb-3">
          <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
            <rect width="40" height="40" rx="20" fill="#266462" />
            <path
              d="M12 14C12 12.8954 12.8954 12 14 12H26C27.1046 12 28 12.8954 28 14V22C28 23.1046 27.1046 24 26 24H22L18 28V24H14C12.8954 24 12 23.1046 12 22V14Z"
              fill="#5D8B8A"
            />
            <circle cx="16" cy="18" r="1.5" fill="white" />
            <circle cx="20" cy="18" r="1.5" fill="white" />
            <circle cx="24" cy="18" r="1.5" fill="white" />
          </svg>
        </div>

        <h4 className="text-white text-sm font-medium mb-1">Need Help?</h4>
        <p className="text-[#F2F2F2] text-[10px] leading-relaxed mb-3">
          If you have any questions, issues, or just need a hand, our support
          team is ready to help.
        </p>

        <Link
          to="/support"
          className="text-[#E8B040] text-xs font-semibold hover:underline"
        >
          Learn more
        </Link>
      </div>
    </div>
  );
}

// Background wave
function BackgroundWave() {
  return (
    <svg
      className="absolute bottom-0 left-0 w-full h-[200px] pointer-events-none"
      viewBox="0 0 438 200"
      fill="none"
      preserveAspectRatio="none"
    >
      <path
        d="M0 200V100C50 120 100 80 150 90C200 100 250 140 300 120C350 100 400 60 438 80V200H0Z"
        fill="#132F2E"
        fillOpacity="0.5"
      />
      <path
        d="M0 200V140C60 160 120 120 180 130C240 140 300 180 360 160C400 145 430 120 438 110V200H0Z"
        fill="#132F2E"
        fillOpacity="0.7"
      />
    </svg>
  );
}

export function WizardLayout({
  children,
  serviceType,
  currentStep,
  onStepClick,
  formValues = {},
  formErrors,
  stepValidation,
  sidebarContent,
}: WizardLayoutProps) {
  const config = getListingConfig(serviceType);
  return (
    <div className="min-h-screen flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-[438px] bg-[#1D4B4A] relative flex-col shrink-0 sticky top-0 h-screen overflow-y-auto">
        <BackgroundWave />

        <div className="relative z-10 flex flex-col min-h-full px-8 py-6">
          {/* Logo */}
          <Link to="/dashboard" className="block mb-6 shrink-0">
            <img
              src="/images/logo/logo.svg"
              alt="HalalHolidayCheck"
              className="h-7 w-auto"
            />
          </Link>

          {/* Steps */}
          <div className="flex-1">
            {sidebarContent ??
              config.steps.map((step, index) => (
                <StepItem
                  key={step.id}
                  step={step}
                  stepIndex={index}
                  currentStep={currentStep}
                  totalSteps={config.steps.length}
                  onStepClick={onStepClick}
                  formValues={formValues}
                  formErrors={formErrors}
                  stepValidation={stepValidation?.[index]}
                />
              ))}
          </div>

          {/* Help section */}
          <div className="mt-6 shrink-0">
            <HelpSection />
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#1D4B4A] z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <img
            src="/images/logo/logo.svg"
            alt="HalalHolidayCheck"
            className="h-6 w-auto"
          />
          <div className="text-white text-sm font-medium">
            Step {currentStep + 1} of {config.steps.length}
          </div>
        </div>
        <div className="mt-3 h-1 bg-[#266462] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#5D8B8A] transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / config.steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-white">
        <div className="max-w-2xl mx-auto px-6 py-12 md:py-12 pt-24 md:pt-12">
          {children}
        </div>
      </main>
    </div>
  );
}
