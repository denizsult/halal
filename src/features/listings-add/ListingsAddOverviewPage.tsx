"use client";

import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores";

import { getListingDraftStorageKeyForService, readListingDraft } from "./draft";
import { WizardLayout } from "./components/wizard";
import type { ServiceType } from "./types";

const steps = [
  {
    id: "hospital-details",
    title: "Hospital details",
    description:
      "Enter your hospital's name, location, and general information.",
    actionLabel: "Edit",
  },
  {
    id: "doctors",
    title: "Our doctors",
    description:
      "Add profiles of your doctors, their specialties, and experience.",
    actionLabel: "Add",
  },
  {
    id: "services",
    title: "Services",
    description:
      "List all medical services, departments, and treatment options available.",
    actionLabel: "Add",
  },
  {
    id: "media",
    title: "Upload Media",
    description: "Add photos of your hospital, rooms and more.",
    actionLabel: "Add",
  },
] as const;

export default function ListingsAddOverviewPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const serviceType = (user?.company?.type ?? "rent_a_car") as ServiceType;
  const storageKey = getListingDraftStorageKeyForService(serviceType);
  const draft = readListingDraft(storageKey);
  const currentStep = draft?.currentStep ?? 0;

  return (
    <WizardLayout
      serviceType={serviceType}
      currentStep={0}
      onStepClick={() => {}}
      sidebarContent={
        <div className="flex-1">
          <h1 className="text-4xl font-semibold leading-tight text-white">
            Showcase
            <br />
            Your Medical
            <br />
            Experts
          </h1>
          <p className="mt-4 text-sm text-white/80 max-w-sm">
            Double-check your details and get ready to welcome your first
            renter.
          </p>
        </div>
      }
    >
      <div className="space-y-6">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const actionLabel = isCompleted || isActive ? "Edit" : "Add";
          return (
            <div
              key={step.id}
              className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-sm"
            >
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                  Step {index + 1}
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {step.title}
                </div>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
              <Button
                onClick={() =>
                  navigate("/listings/add", { state: { step: index } })
                }
                className={
                  actionLabel === "Edit"
                    ? "bg-gray-800 hover:bg-gray-900 text-white rounded-full px-5"
                    : "bg-[#1D4B4A] hover:bg-[#163837] text-white rounded-full px-5"
                }
              >
                {actionLabel}
              </Button>
            </div>
          );
        })}
      </div>
    </WizardLayout>
  );
}
