"use client";

import { useMemo, useState } from "react";

import CollapsibleCard from "./CollapsibleCard";
import UploadCard from "./UploadCard";

type ServiceStatistic = {
  title: string;
  value: string;
};

type ServiceEntry = {
  title: string;
  about: string;
  symptoms: string[];
  doctors: string[];
  statistics: ServiceStatistic[];
  photo?: File | null;
  cover?: File | null;
};

type ServicesValue = {
  services: ServiceEntry[];
};

interface ServicesStepProps {
  value: ServicesValue | undefined;
  onChange: (value: ServicesValue) => void;
  error?: string;
  fieldErrors?: Record<string, unknown>;
}

const symptomOptions = [
  "Neurological Consultation",
  "MRI & CT Scans",
  "Botox Therapy",
  "Surgical Interventions",
  "Orthopedic Care",
  "Cardiology",
];

const doctorOptions = [
  "Dr. Emma Johnson, MD",
  "Dr. Michael Clark, MD",
  "Dr. Sarah Williams, MD",
];

const createEmptyService = (): ServiceEntry => ({
  title: "",
  about: "",
  symptoms: [],
  doctors: [],
  statistics: [],
  photo: null,
  cover: null,
});

const createDefaultValue = (): ServicesValue => ({ services: [] });

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

function ServicesStep({
  value,
  onChange,
  error,
  fieldErrors,
}: ServicesStepProps) {
  const data = useMemo(() => value ?? createDefaultValue(), [value]);
  const [collapsedItems, setCollapsedItems] = useState<Set<number>>(
    () => new Set()
  );

  const updateService = (index: number, patch: Partial<ServiceEntry>) => {
    const next = data.services.map((service, idx) =>
      idx === index ? { ...service, ...patch } : service
    );
    onChange({ ...data, services: next });
  };

  const addService = () => {
    onChange({ ...data, services: [...data.services, createEmptyService()] });
  };

  const removeService = (index: number) => {
    const next = data.services.filter((_, idx) => idx !== index);
    setCollapsedItems((prev) => {
      const nextSet = new Set(prev);
      nextSet.delete(index);
      return new Set(
        [...nextSet].map((value) => (value > index ? value - 1 : value))
      );
    });
    onChange({ ...data, services: next });
  };

  const toggleService = (index: number) => {
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
    serviceIndex: number,
    statIndex: number,
    patch: Partial<ServiceStatistic>
  ) => {
    const nextStats = data.services[serviceIndex].statistics.map((stat, idx) =>
      idx === statIndex ? { ...stat, ...patch } : stat
    );
    updateService(serviceIndex, { statistics: nextStats });
  };

  const addStatistic = (serviceIndex: number) => {
    const nextStats = [
      ...data.services[serviceIndex].statistics,
      { title: "", value: "" },
    ];
    updateService(serviceIndex, { statistics: nextStats });
  };

  const removeStatistic = (serviceIndex: number, statIndex: number) => {
    const nextStats = data.services[serviceIndex].statistics.filter(
      (_, idx) => idx !== statIndex
    );
    updateService(serviceIndex, { statistics: nextStats });
  };

  const toggleSymptom = (serviceIndex: number, option: string) => {
    const current = data.services[serviceIndex].symptoms;
    if (current.includes(option)) {
      updateService(serviceIndex, {
        symptoms: current.filter((item) => item !== option),
      });
      return;
    }
    updateService(serviceIndex, { symptoms: [...current, option] });
  };

  const toggleDoctor = (serviceIndex: number, option: string) => {
    const current = data.services[serviceIndex].doctors;
    if (current.includes(option)) {
      updateService(serviceIndex, {
        doctors: current.filter((item) => item !== option),
      });
      return;
    }
    updateService(serviceIndex, { doctors: [...current, option] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Services</h3>
        <p className="text-sm text-gray-600">
          List all medical treatments and healthcare services available at your
          facility.
        </p>
      </div>

      {data.services.map((service, index) => (
        <CollapsibleCard
          key={index}
          title={`Service ${index + 1}`}
          isOpen={!collapsedItems.has(index)}
          onToggle={() => toggleService(index)}
          onRemove={() => removeService(index)}
        >
          <div>
            <label
              htmlFor={`service-${index}-title`}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title *
            </label>
            <input
              id={`service-${index}-title`}
              value={service.title}
              onChange={(event) =>
                updateService(index, { title: event.target.value })
              }
              placeholder="Neurology"
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-gray-300 focus:outline-none"
            />
            {getError(fieldErrors, `services.${index}.title`)?.message && (
              <p className="mt-2 text-xs text-red-500">
                {getError(fieldErrors, `services.${index}.title`)?.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label
              htmlFor={`service-${index}-about`}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              About service *
            </label>
            <textarea
              id={`service-${index}-about`}
              value={service.about}
              onChange={(event) =>
                updateService(index, { about: event.target.value })
              }
              placeholder="About neurology"
              rows={4}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-300 focus:outline-none"
            />
            {getError(fieldErrors, `services.${index}.about`)?.message && (
              <p className="mt-2 text-xs text-red-500">
                {getError(fieldErrors, `services.${index}.about`)?.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Symptoms *
            </label>
            <div className="flex flex-wrap gap-2">
              {symptomOptions.map((option) => {
                const isSelected = service.symptoms.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleSymptom(index, option)}
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
            {getError(fieldErrors, `services.${index}.symptoms`)?.message && (
              <p className="mt-2 text-xs text-red-500">
                {getError(fieldErrors, `services.${index}.symptoms`)?.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Doctors *
              </label>
              <button type="button" className="text-xs text-[#E8B040]">
                Add new doctor
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {doctorOptions.map((option) => {
                const isSelected = service.doctors.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleDoctor(index, option)}
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
            {getError(fieldErrors, `services.${index}.doctors`)?.message && (
              <p className="mt-2 text-xs text-red-500">
                {getError(fieldErrors, `services.${index}.doctors`)?.message}
              </p>
            )}
          </div>

          <div className="mt-6 space-y-3">
            {service.statistics.map((stat, statIndex) => (
              <div
                key={`${index}-stat-${statIndex}`}
                className="grid grid-cols-1 gap-3 md:grid-cols-2"
              >
                <div>
                  <label
                    htmlFor={`service-${index}-stat-${statIndex}-title`}
                    className="block text-xs font-medium text-gray-500 mb-1"
                  >
                    Title
                  </label>
                  <input
                    id={`service-${index}-stat-${statIndex}-title`}
                    value={stat.title}
                    onChange={(event) =>
                      updateStatistic(index, statIndex, {
                        title: event.target.value,
                      })
                    }
                    placeholder="Successful Appointments"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-gray-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`service-${index}-stat-${statIndex}-value`}
                    className="block text-xs font-medium text-gray-500 mb-1"
                  >
                    Data
                  </label>
                  <input
                    id={`service-${index}-stat-${statIndex}-value`}
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
                  `services.${index}.statistics.${statIndex}.title`
                )?.message && (
                  <p className="md:col-span-2 text-xs text-red-500">
                    {
                      getError(
                        fieldErrors,
                        `services.${index}.statistics.${statIndex}.title`
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
              title="Upload Photo"
              description="Add high-quality images that represent your property, service, or facility."
              accept="image/*"
              formatsText="JPG, PNG"
              maxSizeText="7 MB"
              value={service.photo ?? null}
              onChange={(file) =>
                updateService(index, { photo: file as File | null })
              }
            />
            {getError(fieldErrors, `services.${index}.photo`)?.message && (
              <p className="text-xs text-red-500">
                {getError(fieldErrors, `services.${index}.photo`)?.message}
              </p>
            )}
            <UploadCard
              title="Upload Cover Photo"
              description="Upload a standout image that will be shown as the main visual on your listing."
              accept="image/*"
              formatsText="JPG, PNG"
              maxSizeText="7 MB"
              value={service.cover ?? null}
              onChange={(file) =>
                updateService(index, { cover: file as File | null })
              }
            />
            {getError(fieldErrors, `services.${index}.cover`)?.message && (
              <p className="text-xs text-red-500">
                {getError(fieldErrors, `services.${index}.cover`)?.message}
              </p>
            )}
          </div>
        </CollapsibleCard>
      ))}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={addService}
          className="inline-flex items-center gap-2 rounded-full bg-[#2F2F2F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1f1f1f]"
        >
          <span className="text-lg leading-none">+</span>
          Add service
        </button>
      </div>
      {getError(fieldErrors, "services")?.message && (
        <p className="text-sm text-red-500">
          {getError(fieldErrors, "services")?.message}
        </p>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default ServicesStep;
