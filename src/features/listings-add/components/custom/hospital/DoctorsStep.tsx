"use client";

import { useMemo, useState } from "react";

import CollapsibleCard from "./CollapsibleCard";
import UploadCard from "./UploadCard";

type DoctorStatistic = {
  title: string;
  value: string;
};

type DoctorEntry = {
  title: string;
  fullName: string;
  rating: string;
  about: string;
  expertise: string[];
  statistics: DoctorStatistic[];
  photo?: File | null;
  license?: File | null;
  certificates?: File[] | null;
};

type DoctorsValue = {
  doctors: DoctorEntry[];
};

interface DoctorsStepProps {
  value: DoctorsValue | undefined;
  onChange: (value: DoctorsValue) => void;
  error?: string;
  fieldErrors?: Record<string, unknown>;
}

const titleOptions = ["Dr.", "Mr.", "Mrs.", "Ms."] as const;
const expertiseOptions = [
  "Neurological Consultation",
  "MRI & CT Scans",
  "Botox Therapy",
  "Surgical Interventions",
  "Orthopedic Care",
  "Cardiology",
];

const createEmptyDoctor = (): DoctorEntry => ({
  title: "",
  fullName: "",
  rating: "",
  about: "",
  expertise: [],
  statistics: [],
  photo: null,
  license: null,
  certificates: null,
});

const createDefaultValue = (): DoctorsValue => ({ doctors: [] });

const getError = (
  errors: Record<string, unknown> | undefined,
  path: string
) => {
  if (!errors) return undefined;
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, errors) as { message?: string } | undefined;
};

function DoctorsStep({
  value,
  onChange,
  error,
  fieldErrors,
}: DoctorsStepProps) {
  const data = useMemo(() => value ?? createDefaultValue(), [value]);
  const [collapsedItems, setCollapsedItems] = useState<Set<number>>(
    () => new Set()
  );

  const updateDoctor = (index: number, patch: Partial<DoctorEntry>) => {
    const next = data.doctors.map((doctor, idx) =>
      idx === index ? { ...doctor, ...patch } : doctor
    );
    onChange({ ...data, doctors: next });
  };

  const addDoctor = () => {
    onChange({ ...data, doctors: [...data.doctors, createEmptyDoctor()] });
  };

  const removeDoctor = (index: number) => {
    const next = data.doctors.filter((_, idx) => idx !== index);
    setCollapsedItems((prev) => {
      const nextSet = new Set(prev);
      nextSet.delete(index);
      return new Set(
        [...nextSet].map((value) => (value > index ? value - 1 : value))
      );
    });
    onChange({ ...data, doctors: next });
  };

  const toggleDoctor = (index: number) => {
    setCollapsedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const updateStatistic = (
    doctorIndex: number,
    statIndex: number,
    patch: Partial<DoctorStatistic>
  ) => {
    const nextStats = data.doctors[doctorIndex].statistics.map((stat, idx) =>
      idx === statIndex ? { ...stat, ...patch } : stat
    );
    updateDoctor(doctorIndex, { statistics: nextStats });
  };

  const addStatistic = (doctorIndex: number) => {
    const nextStats = [
      ...data.doctors[doctorIndex].statistics,
      { title: "", value: "" },
    ];
    updateDoctor(doctorIndex, { statistics: nextStats });
  };

  const removeStatistic = (doctorIndex: number, statIndex: number) => {
    const nextStats = data.doctors[doctorIndex].statistics.filter(
      (_, idx) => idx !== statIndex
    );
    updateDoctor(doctorIndex, { statistics: nextStats });
  };

  const toggleExpertise = (doctorIndex: number, option: string) => {
    const current = data.doctors[doctorIndex].expertise;
    if (current.includes(option)) {
      updateDoctor(doctorIndex, {
        expertise: current.filter((item) => item !== option),
      });
      return;
    }
    updateDoctor(doctorIndex, { expertise: [...current, option] });
  };

  return (
    <div className="space-y-6">
      {data.doctors.map((doctor, index) => (
        <CollapsibleCard
          key={index}
          title={`Doctor ${index + 1}`}
          isOpen={!collapsedItems.has(index)}
          onToggle={() => toggleDoctor(index)}
          onRemove={() => removeDoctor(index)}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor={`doctor-${index}-title`}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Address *
              </label>
              <select
                id={`doctor-${index}-title`}
                value={doctor.title}
                onChange={(event) =>
                  updateDoctor(index, { title: event.target.value })
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus:border-gray-300 focus:outline-none"
              >
                <option value="">Select</option>
                {titleOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {getError(fieldErrors, `doctors.${index}.title`)?.message && (
                <p className="mt-2 text-xs text-red-500">
                  {getError(fieldErrors, `doctors.${index}.title`)?.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor={`doctor-${index}-full-name`}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full name *
              </label>
              <input
                id={`doctor-${index}-full-name`}
                value={doctor.fullName}
                onChange={(event) =>
                  updateDoctor(index, { fullName: event.target.value })
                }
                placeholder="Alexander Reid"
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-gray-300 focus:outline-none"
              />
              {getError(fieldErrors, `doctors.${index}.fullName`)?.message && (
                <p className="mt-2 text-xs text-red-500">
                  {getError(fieldErrors, `doctors.${index}.fullName`)?.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor={`doctor-${index}-rating`}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Rating *
            </label>
            <input
              id={`doctor-${index}-rating`}
              type="number"
              min={0}
              max={5}
              step="0.1"
              inputMode="decimal"
              value={doctor.rating}
              onChange={(event) =>
                updateDoctor(index, { rating: event.target.value })
              }
              placeholder="4.9"
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-gray-300 focus:outline-none"
            />
            {getError(fieldErrors, `doctors.${index}.rating`)?.message && (
              <p className="mt-2 text-xs text-red-500">
                {getError(fieldErrors, `doctors.${index}.rating`)?.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label
              htmlFor={`doctor-${index}-about`}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              About doctor *
            </label>
            <textarea
              id={`doctor-${index}-about`}
              value={doctor.about}
              onChange={(event) =>
                updateDoctor(index, { about: event.target.value })
              }
              placeholder="Acibadem"
              rows={4}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-300 focus:outline-none"
            />
            {getError(fieldErrors, `doctors.${index}.about`)?.message && (
              <p className="mt-2 text-xs text-red-500">
                {getError(fieldErrors, `doctors.${index}.about`)?.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Area of expertise *
            </label>
            <div className="flex flex-wrap gap-2">
              {expertiseOptions.map((option) => {
                const isSelected = doctor.expertise.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleExpertise(index, option)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      isSelected
                        ? "border-[#1D4B4A] bg-[#E3ECEB] text-[#1D4B4A]"
                        : "border-gray-200 bg-white text-gray-500"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {getError(fieldErrors, `doctors.${index}.expertise`)?.message && (
              <p className="mt-2 text-xs text-red-500">
                {getError(fieldErrors, `doctors.${index}.expertise`)?.message}
              </p>
            )}
          </div>

          <div className="mt-6 space-y-3">
            {doctor.statistics.map((stat, statIndex) => (
              <div
                key={`${index}-stat-${statIndex}`}
                className="grid grid-cols-1 gap-3 md:grid-cols-2"
              >
                <div>
                  <label
                    htmlFor={`doctor-${index}-stat-${statIndex}-title`}
                    className="block text-xs font-medium text-gray-500 mb-1"
                  >
                    Title
                  </label>
                  <input
                    id={`doctor-${index}-stat-${statIndex}-title`}
                    value={stat.title}
                    onChange={(event) =>
                      updateStatistic(index, statIndex, {
                        title: event.target.value,
                      })
                    }
                    placeholder="International Certifications"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-gray-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`doctor-${index}-stat-${statIndex}-value`}
                    className="block text-xs font-medium text-gray-500 mb-1"
                  >
                    Data
                  </label>
                  <input
                    id={`doctor-${index}-stat-${statIndex}-value`}
                    value={stat.value}
                    onChange={(event) =>
                      updateStatistic(index, statIndex, {
                        value: event.target.value,
                      })
                    }
                    placeholder="35000+"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-gray-300 focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2 text-right">
                  <button
                    type="button"
                    onClick={() => removeStatistic(index, statIndex)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove statistic
                  </button>
                </div>
                {getError(
                  fieldErrors,
                  `doctors.${index}.statistics.${statIndex}.title`
                )?.message && (
                  <p className="md:col-span-2 text-xs text-red-500">
                    {
                      getError(
                        fieldErrors,
                        `doctors.${index}.statistics.${statIndex}.title`
                      )?.message
                    }
                  </p>
                )}
              </div>
            ))}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => addStatistic(index)}
                className="text-sm font-medium text-gray-700 hover:underline"
              >
                + Add statistics
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <UploadCard
              title="Upload Doctor Photo"
              description="Add a professional headshot of the doctor for the profile page."
              accept="image/*"
              formatsText="JPG, PNG"
              maxSizeText="7 MB"
              value={doctor.photo ?? null}
              onChange={(file) =>
                updateDoctor(index, { photo: file as File | null })
              }
            />
            {getError(fieldErrors, `doctors.${index}.photo`)?.message && (
              <p className="text-xs text-red-500">
                {getError(fieldErrors, `doctors.${index}.photo`)?.message}
              </p>
            )}
            <UploadCard
              title="Upload Doctor License"
              description="Provide a valid medical license to verify the doctor’s professional credentials."
              accept="application/pdf,image/*"
              formatsText="PDF, JPG, PNG"
              maxSizeText="10 MB"
              value={doctor.license ?? null}
              onChange={(file) =>
                updateDoctor(index, { license: file as File | null })
              }
            />
            {getError(fieldErrors, `doctors.${index}.license`)?.message && (
              <p className="text-xs text-red-500">
                {getError(fieldErrors, `doctors.${index}.license`)?.message}
              </p>
            )}
            <UploadCard
              title="Upload Doctor Certificates"
              description="Include relevant medical certifications or specializations to showcase expertise."
              accept="application/pdf,image/*"
              formatsText="PDF, JPG, PNG"
              maxSizeText="10 MB"
              value={doctor.certificates ?? null}
              multiple
              onChange={(files) =>
                updateDoctor(index, { certificates: files as File[] | null })
              }
            />
          </div>
        </CollapsibleCard>
      ))}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={addDoctor}
          className="inline-flex items-center gap-2 rounded-full bg-[#2F2F2F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1f1f1f]"
        >
          <span className="text-lg leading-none">+</span>
          Add doctor
        </button>
      </div>
      {getError(fieldErrors, "doctors")?.message && (
        <p className="text-sm text-red-500">
          {getError(fieldErrors, "doctors")?.message}
        </p>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default DoctorsStep;
