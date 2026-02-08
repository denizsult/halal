"use client";

import { useMemo } from "react";

type MissionVisionValue = {
  mission: string;
  vision: string;
};

interface MissionVisionStepProps {
  value: MissionVisionValue | undefined;
  onChange: (value: MissionVisionValue) => void;
  error?: string;
  fieldErrors?: Record<string, { message?: string }>;
}

const createDefaultValue = (): MissionVisionValue => ({
  mission: "",
  vision: "",
});

function MissionVisionStep({
  value,
  onChange,
  error,
  fieldErrors,
}: MissionVisionStepProps) {
  const data = useMemo(() => value ?? createDefaultValue(), [value]);

  const updateField = (field: keyof MissionVisionValue, val: string) => {
    onChange({
      ...data,
      [field]: val,
    });
  };

  const missionError = fieldErrors?.mission?.message;
  const visionError = fieldErrors?.vision?.message;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <label
          htmlFor="mission"
          className="block text-sm font-semibold text-gray-800 mb-1"
        >
          Mission
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Give the customer a taste of what they&apos;ll do in 2 or 3 sentences.
          This will be the first thing customers read after the title, and will
          inspire them to continue.
        </p>
        <textarea
          id="mission"
          rows={4}
          value={data.mission}
          onChange={(e) => updateField("mission", e.target.value)}
          placeholder="Apartment, building, floor, etc"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-300 focus:outline-none"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
          <span className={missionError ? "text-red-500" : ""}>
            {missionError ? missionError : ""}
          </span>
          <span>{data.mission.length} / 200</span>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <label
          htmlFor="vision"
          className="block text-sm font-semibold text-gray-800 mb-1"
        >
          Vision
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Provide all the details about what the customer will see and
          experience during the activity, in the correct order. Bring the
          activity to life and write at least 500 characters.
        </p>
        <textarea
          id="vision"
          rows={5}
          value={data.vision}
          onChange={(e) => updateField("vision", e.target.value)}
          placeholder="Apartment, building, floor, etc"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-300 focus:outline-none"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
          <span className={visionError ? "text-red-500" : ""}>
            {visionError ? visionError : ""}
          </span>
          <span>{data.vision.length} / 3000</span>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default MissionVisionStep;
