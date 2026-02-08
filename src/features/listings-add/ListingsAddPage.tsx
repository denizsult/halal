"use client";

import { useAuthStore } from "@/stores";

import { WizardForm } from "./components/wizard";
import { getListingDraftPersistKey } from "./draft";
import { isListingServiceType, type ServiceType } from "./types";
import { useLocation } from "react-router-dom";

export default function ListingsAddPage() {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const serviceType = user.company?.type ?? "rent_a_car";

  if (!isListingServiceType(serviceType as ServiceType)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Service Type Not Found
          </h2>
          <p className="text-gray-600">
            Your account does not have a valid service type configured. Please
            contact support.
          </p>
        </div>
      </div>
    );
  }

  const stateStep =
    typeof location.state === "object" &&
    location.state &&
    "step" in (location.state as Record<string, unknown>)
      ? (location.state as Record<string, unknown>).step
      : undefined;
  const parsedStep =
    typeof stateStep === "number" && Number.isFinite(stateStep)
      ? stateStep
      : undefined;

  return (
    <WizardForm
      serviceType={serviceType as ServiceType}
      appUserId={user.id}
      persistKey={getListingDraftPersistKey(serviceType as ServiceType)}
      initialStep={parsedStep}
    />
  );
}
