"use client";

import { useEffect, useState } from "react";

export interface TransferBranch {
  headquarter_name: string;
  headquarter_address: string;
  is_closed: boolean;
  is_main_branch: boolean;
}

interface BranchesStepProps {
  value: TransferBranch[] | undefined;
  onChange: (value: TransferBranch[]) => void;
  error?: string;
}

const defaultBranches: TransferBranch[] = [
  {
    headquarter_name: "",
    headquarter_address: "",
    is_closed: false,
    is_main_branch: true,
  },
];

function BranchesStep({ value, onChange, error }: BranchesStepProps) {
  const branches = value && value.length > 0 ? value : defaultBranches;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!value || value.length === 0) {
      onChange(defaultBranches);
    }
  }, []);

  const addBranch = () => {
    onChange([
      ...branches,
      {
        headquarter_name: "",
        headquarter_address: "",
        is_closed: false,
        is_main_branch: false,
      },
    ]);
    setExpandedIndex(branches.length);
  };

  const removeBranch = (index: number) => {
    if (branches[index].is_main_branch) return;
    onChange(branches.filter((_, i) => i !== index));
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const updateBranch = (
    index: number,
    field: keyof TransferBranch,
    fieldValue: string | boolean
  ) => {
    const updated = branches.map((branch, i) =>
      i === index ? { ...branch, [field]: fieldValue } : branch
    );
    onChange(updated);
  };

  // Headquarter is always the first item, rendered separately
  const headquarter = branches[0];
  const additionalBranches = branches.slice(1);

  return (
    <div className="space-y-6">
      {/* Headquarter */}
      <div className="p-5 border border-gray-200 rounded-xl space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Headquarter name
            </label>
            <input
              type="text"
              value={headquarter.headquarter_name}
              onChange={(e) =>
                updateBranch(0, "headquarter_name", e.target.value)
              }
              placeholder="Headquarter name"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Headquarter address
            </label>
            <input
              type="text"
              value={headquarter.headquarter_address}
              onChange={(e) =>
                updateBranch(0, "headquarter_address", e.target.value)
              }
              placeholder="Headquarter address"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Additional Branches */}
      <div className="space-y-4">
        {additionalBranches.map((branch, branchIdx) => {
          const realIndex = branchIdx + 1;
          const isExpanded = expandedIndex === realIndex;

          return (
            <div
              key={realIndex}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              {/* Branch Header */}
              <div
                className={`flex items-center gap-3 p-4 cursor-pointer ${
                  isExpanded ? "bg-gray-50" : "bg-white"
                }`}
                onClick={() => setExpandedIndex(isExpanded ? null : realIndex)}
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
                  Branch {branchIdx + 1}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBranch(realIndex);
                  }}
                  className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>

              {/* Branch Content */}
              {isExpanded && (
                <div className="p-4 pt-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1.5">
                        Headquarter name
                      </label>
                      <input
                        type="text"
                        value={branch.headquarter_name}
                        onChange={(e) =>
                          updateBranch(
                            realIndex,
                            "headquarter_name",
                            e.target.value
                          )
                        }
                        placeholder="Branch name"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1.5">
                        Headquarter address
                      </label>
                      <input
                        type="text"
                        value={branch.headquarter_address}
                        onChange={(e) =>
                          updateBranch(
                            realIndex,
                            "headquarter_address",
                            e.target.value
                          )
                        }
                        placeholder="Branch address"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={branch.is_closed}
                      onChange={(e) =>
                        updateBranch(realIndex, "is_closed", e.target.checked)
                      }
                      className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700">
                      Closed temporarily
                    </span>
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Branch Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={addBranch}
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
          Add branch
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default BranchesStep;
