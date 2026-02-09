"use client";

interface WizardNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
}

export function WizardNavigation({
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
  isLastStep,
  isSubmitting,
}: WizardNavigationProps) {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
      {/* Back Button */}
      <button
        type="button"
        onClick={onPrev}
        disabled={!canGoPrev || isSubmitting}
        className={`
          flex items-center gap-2 px-6 py-3 rounded-xl
          text-sm font-medium transition-all
          ${
            canGoPrev && !isSubmitting
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "bg-gray-50 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>

      {/* Next/Submit Button */}
      <button
        type="button"
        onClick={onNext}
        disabled={!canGoNext || isSubmitting}
        className={`
          flex items-center gap-2 px-6 py-3 rounded-xl
          text-sm font-medium transition-all
          ${
            canGoNext && !isSubmitting
              ? "bg-teal-600 text-white hover:bg-teal-700"
              : "bg-teal-300 text-white cursor-not-allowed"
          }
        `}
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </>
        ) : (
          <>
            {isLastStep ? "Complete" : "Next"}
            {!isLastStep && (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </>
        )}
      </button>
    </div>
  );
}
