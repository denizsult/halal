"use client";

import { useFormContext } from "react-hook-form";

import {
  getSubStepIndex,
  useWizardUiSnapshot,
} from "../../../state/wizard-ui.store";
import AwardsStep from "./AwardsStep";
import CertificatesStep from "./CertificatesStep";
import LocationsStep from "./LocationsStep";
import MissionVisionStep from "./MissionVisionStep";
import StatisticsStep from "./StatisticsStep";

export const HOSPITAL_DETAILS_SUB_STEPS = [
  {
    id: "locations",
    title: "Hospital locations",
    description:
      "List all branches or facility locations to help users find the nearest one.",
  },
  {
    id: "mission-vision",
    title: "Mission & Vision",
    description:
      "Share your hospital's core purpose and long-term goals to build trust with patients.",
  },
  {
    id: "statistics",
    title: "Statistics",
    description:
      "Showcase key achievements like number of patients treated, departments, or years of service.",
  },
  {
    id: "certificates",
    title: "Certificates",
    description:
      "Upload verified medical, quality, or compliance certifications your hospital holds.",
  },
  {
    id: "awards",
    title: "Awards",
    description:
      "Highlight any healthcare awards or recognitions your hospital has received.",
  },
] as const;

function HospitalDetailsStep() {
  useWizardUiSnapshot();
  const activeIndex = getSubStepIndex("hospital-details");
  const { watch, setValue, formState } = useFormContext();

  const locations = watch("locations");
  const missionVision = watch("missionVision");
  const statistics = watch("statistics");
  const certificates = watch("certificates");
  const awards = watch("awards");

  const activeSubStep = HOSPITAL_DETAILS_SUB_STEPS[activeIndex];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {activeSubStep.title}
        </h3>
        <p className="text-sm text-gray-600">{activeSubStep.description}</p>
      </div>

      {activeIndex === 0 && (
        <LocationsStep
          value={locations}
          onChange={(value) =>
            setValue("locations", value, { shouldDirty: true })
          }
          fieldErrors={
            formState.errors.locations as Record<string, { message?: string }>
          }
        />
      )}
      {activeIndex === 1 && (
        <MissionVisionStep
          value={missionVision}
          onChange={(value) =>
            setValue("missionVision", value, { shouldDirty: true })
          }
          fieldErrors={
            formState.errors.missionVision as Record<
              string,
              { message?: string }
            >
          }
        />
      )}
      {activeIndex === 2 && (
        <StatisticsStep
          value={statistics}
          onChange={(value) =>
            setValue("statistics", value, { shouldDirty: true })
          }
          fieldErrors={
            (
              formState.errors.statistics as {
                statistics?: Record<string, unknown>;
              }
            )?.statistics
          }
        />
      )}
      {activeIndex === 3 && (
        <CertificatesStep
          value={certificates}
          onChange={(value) =>
            setValue("certificates", value, { shouldDirty: true })
          }
          fieldErrors={
            (
              formState.errors.certificates as {
                certificates?: Record<string, unknown>;
              }
            )?.certificates
          }
        />
      )}
      {activeIndex === 4 && (
        <AwardsStep
          value={awards}
          onChange={(value) => setValue("awards", value, { shouldDirty: true })}
          fieldErrors={
            (formState.errors.awards as { awards?: Record<string, unknown> })
              ?.awards
          }
        />
      )}
    </div>
  );
}

export default HospitalDetailsStep;
