"use client";

import { useEffect, useState } from "react";

export interface TransferExpertise {
  title: string;
  description: string;
}

interface ExpertisesStepProps {
  value: TransferExpertise[] | undefined;
  onChange: (value: TransferExpertise[]) => void;
  error?: string;
}

const defaultExpertises: TransferExpertise[] = [
  {
    title: "",
    description: "",
  },
];

function ExpertisesStep({ value, onChange, error }: ExpertisesStepProps) {
  const expertises = value && value.length > 0 ? value : defaultExpertises;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  useEffect(() => {
    if (!value || value.length === 0) {
      onChange(defaultExpertises);
    }
  }, []);

  const addExpertise = () => {
    onChange([...expertises, { title: "", description: "" }]);
    setExpandedIndex(expertises.length);
  };

  const removeExpertise = (index: number) => {
    if (expertises.length <= 1) return;
    onChange(expertises.filter((_, i) => i !== index));
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const updateExpertise = (
    index: number,
    field: keyof TransferExpertise,
    fieldValue: string
  ) => {
    const updated = expertises.map((expertise, i) =>
      i === index ? { ...expertise, [field]: fieldValue } : expertise
    );
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Expertises List */}
      <div className="space-y-4">
        {expertises.map((expertise, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              {/* Expertise Header */}
              <div
                className={`flex items-center gap-3 p-4 cursor-pointer ${
                  isExpanded ? "bg-gray-50" : "bg-white"
                }`}
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
              >
                <button
                  type="button"
                  className="flex-shrink-0 w-6 h-6 flex items-center justify-center"
                >
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <span className="flex-1 font-medium text-gray-900">
                  Expertise {index + 1}
                </span>
                {expertises.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeExpertise(index);
                    }}
                    className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Expertise Content */}
              {isExpanded && (
                <div className="p-4 pt-2 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">
                      Title
                    </label>
                    <input
                      type="text"
                      value={expertise.title}
                      onChange={(e) =>
                        updateExpertise(index, "title", e.target.value)
                      }
                      placeholder="e.g., Airport Transfers"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">
                      Description
                    </label>
                    <textarea
                      value={expertise.description}
                      onChange={(e) =>
                        updateExpertise(index, "description", e.target.value)
                      }
                      placeholder="Describe your expertise in this area..."
                      rows={3}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Expertise Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={addExpertise}
          className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm font-medium"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add area
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default ExpertisesStep;
