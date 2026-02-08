"use client";

import { useMemo, useState } from "react";

import CollapsibleCard from "./CollapsibleCard";

type HospitalLocation = {
  name: string;
  address: string;
  isTemporarilyClosed?: boolean;
};

type HospitalLocationsValue = {
  headquartersName: string;
  headquartersAddress: string;
  branches: HospitalLocation[];
};

interface LocationsStepProps {
  value: HospitalLocationsValue | undefined;
  onChange: (value: HospitalLocationsValue) => void;
  error?: string;
  fieldErrors?: Record<string, { message?: string }>;
}

const createEmptyBranch = (): HospitalLocation => ({
  name: "",
  address: "",
  isTemporarilyClosed: false,
});

const createDefaultValue = (): HospitalLocationsValue => ({
  headquartersName: "",
  headquartersAddress: "",
  branches: [],
});

function LocationsStep({
  value,
  onChange,
  error,
  fieldErrors,
}: LocationsStepProps) {
  const data = useMemo(() => value ?? createDefaultValue(), [value]);
  const [collapsedBranches, setCollapsedBranches] = useState<Set<number>>(
    () => new Set()
  );

  const updateHeadquarters = (
    field: "headquartersName" | "headquartersAddress",
    val: string
  ) => {
    onChange({
      ...data,
      [field]: val,
    });
  };

  const updateBranch = (index: number, patch: Partial<HospitalLocation>) => {
    const nextBranches = data.branches.map((branch, idx) =>
      idx === index ? { ...branch, ...patch } : branch
    );
    onChange({
      ...data,
      branches: nextBranches,
    });
  };

  const removeBranch = (index: number) => {
    const nextBranches = data.branches.filter((_, idx) => idx !== index);
    setCollapsedBranches((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return new Set(
        [...next].map((value) => (value > index ? value - 1 : value))
      );
    });
    onChange({
      ...data,
      branches: nextBranches,
    });
  };

  const addBranch = () => {
    onChange({
      ...data,
      branches: [...data.branches, createEmptyBranch()],
    });
  };

  const toggleBranch = (index: number) => {
    setCollapsedBranches((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const headquarterNameError = fieldErrors?.headquartersName?.message;
  const headquarterAddressError = fieldErrors?.headquartersAddress?.message;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="headquarters-name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Headquarter name
            </label>
            <input
              id="headquarters-name"
              type="text"
              value={data.headquartersName}
              onChange={(e) =>
                updateHeadquarters("headquartersName", e.target.value)
              }
              placeholder="Acibadem"
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-gray-300 focus:outline-none"
            />
            {headquarterNameError && (
              <p className="mt-2 text-xs text-red-500">
                {headquarterNameError}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="headquarters-address"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Headquarter address
            </label>
            <input
              id="headquarters-address"
              type="text"
              value={data.headquartersAddress}
              onChange={(e) =>
                updateHeadquarters("headquartersAddress", e.target.value)
              }
              placeholder="Acibadem"
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-gray-300 focus:outline-none"
            />
            {headquarterAddressError && (
              <p className="mt-2 text-xs text-red-500">
                {headquarterAddressError}
              </p>
            )}
          </div>
        </div>
      </div>

      {data.branches.map((branch, index) => (
        <CollapsibleCard
          key={index}
          title={`Branch ${index + 1}`}
          isOpen={!collapsedBranches.has(index)}
          onToggle={() => toggleBranch(index)}
          onRemove={() => removeBranch(index)}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor={`branch-${index}-name`}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Headquarter name
              </label>
              <input
                id={`branch-${index}-name`}
                type="text"
                value={branch.name}
                onChange={(e) => updateBranch(index, { name: e.target.value })}
                placeholder="Acibadem"
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-gray-300 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor={`branch-${index}-address`}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Headquarter address
              </label>
              <input
                id={`branch-${index}-address`}
                type="text"
                value={branch.address}
                onChange={(e) =>
                  updateBranch(index, { address: e.target.value })
                }
                placeholder="Acibadem"
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-gray-300 focus:outline-none"
              />
            </div>
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={Boolean(branch.isTemporarilyClosed)}
              onChange={(e) =>
                updateBranch(index, { isTemporarilyClosed: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300 text-[#1D4B4A] focus:ring-[#1D4B4A]"
            />
            Closed temporarily
          </label>
        </CollapsibleCard>
      ))}

      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={addBranch}
          className="inline-flex items-center gap-2 rounded-full bg-[#2F2F2F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1f1f1f]"
        >
          <span className="text-lg leading-none">+</span>
          Add branch
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default LocationsStep;
