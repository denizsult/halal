"use client";

import { useMemo, useState } from "react";

import CollapsibleCard from "./CollapsibleCard";

type StatisticItem = {
  title: string;
  value: string;
};

type StatisticsValue = {
  statistics: StatisticItem[];
};

interface StatisticsStepProps {
  value: StatisticsValue | undefined;
  onChange: (value: StatisticsValue) => void;
  error?: string;
  fieldErrors?: Record<string, unknown>;
}

const createDefaultValue = (): StatisticsValue => ({ statistics: [] });
const createEmptyItem = (): StatisticItem => ({ title: "", value: "" });

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

function StatisticsStep({
  value,
  onChange,
  error,
  fieldErrors,
}: StatisticsStepProps) {
  const data = useMemo(() => value ?? createDefaultValue(), [value]);
  const [collapsedItems, setCollapsedItems] = useState<Set<number>>(
    () => new Set()
  );

  const updateItem = (index: number, patch: Partial<StatisticItem>) => {
    const next = data.statistics.map((item, idx) =>
      idx === index ? { ...item, ...patch } : item
    );
    onChange({ ...data, statistics: next });
  };

  const removeItem = (index: number) => {
    const next = data.statistics.filter((_, idx) => idx !== index);
    setCollapsedItems((prev) => {
      const nextCollapsed = new Set(prev);
      nextCollapsed.delete(index);
      return new Set(
        [...nextCollapsed].map((value) => (value > index ? value - 1 : value))
      );
    });
    onChange({ ...data, statistics: next });
  };

  const addItem = () => {
    onChange({ ...data, statistics: [...data.statistics, createEmptyItem()] });
  };

  const toggleItem = (index: number) => {
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

  return (
    <div className="space-y-6">
      {data.statistics.map((item, index) => (
        <CollapsibleCard
          key={index}
          title={`Statistic ${index + 1}`}
          isOpen={!collapsedItems.has(index)}
          onToggle={() => toggleItem(index)}
          onRemove={() => removeItem(index)}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor={`stat-${index}-title`}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title
              </label>
              <input
                id={`stat-${index}-title`}
                type="text"
                value={item.title}
                onChange={(e) => updateItem(index, { title: e.target.value })}
                placeholder="International Certifications"
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-gray-300 focus:outline-none"
              />
              {getError(fieldErrors, `${index}.title`)?.message && (
                <p className="mt-2 text-xs text-red-500">
                  {getError(fieldErrors, `${index}.title`)?.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor={`stat-${index}-value`}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Data
              </label>
              <input
                id={`stat-${index}-value`}
                type="text"
                value={item.value}
                onChange={(e) => updateItem(index, { value: e.target.value })}
                placeholder="35000+"
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-gray-300 focus:outline-none"
              />
              {getError(fieldErrors, `${index}.value`)?.message && (
                <p className="mt-2 text-xs text-red-500">
                  {getError(fieldErrors, `${index}.value`)?.message}
                </p>
              )}
            </div>
          </div>
        </CollapsibleCard>
      ))}

      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-2 rounded-full bg-[#2F2F2F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1f1f1f]"
        >
          <span className="text-lg leading-none">+</span>
          Add statistics
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default StatisticsStep;
