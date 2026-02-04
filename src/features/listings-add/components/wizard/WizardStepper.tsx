"use client";

import type { FormStep } from "../../types";

interface WizardStepperProps {
  steps: FormStep[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function WizardStepper({
  steps,
  currentStep,
  onStepClick,
}: WizardStepperProps) {
  return (
    <div className="flex flex-col gap-4">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isClickable = index <= currentStep;

        return (
          <button
            key={step.id}
            type="button"
            onClick={() => isClickable && onStepClick(index)}
            disabled={!isClickable}
            className={`
              flex items-start gap-4 text-left transition-all
              ${isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
            `}
          >
            {/* Step Number */}
            <div
              className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                text-sm font-semibold transition-colors
                ${
                  isActive
                    ? "bg-white text-teal-700"
                    : isCompleted
                      ? "bg-teal-600 text-white"
                      : "bg-teal-800 text-teal-300"
                }
              `}
            >
              {isCompleted ? (
                <svg
                  className="w-5 h-5"
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
              ) : (
                index + 1
              )}
            </div>

            {/* Step Content */}
            <div className="flex-1 pt-1">
              <div
                className={`
                  text-sm font-semibold
                  ${isActive ? "text-white" : "text-teal-200"}
                `}
              >
                {step.title}
              </div>
              <div
                className={`
                  text-xs mt-1
                  ${isActive ? "text-white/80" : "text-teal-300/60"}
                `}
              >
                {step.description}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
