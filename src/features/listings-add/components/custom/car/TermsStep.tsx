"use client";

import { useEffect, useState } from "react";

import type { CarTerm } from "../../../types";

interface TermsStepProps {
  value: CarTerm[] | undefined;
  onChange: (value: CarTerm[]) => void;
  error?: string;
}

const defaultTerms: CarTerm[] = [
  {
    title: "",
    content: [""],
  },
];

function TermsStep({ value, onChange, error }: TermsStepProps) {
  const terms = value && value.length > 0 ? value : defaultTerms;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  // Initialize form with default values if not set
  useEffect(() => {
    if (!value || value.length === 0) {
      onChange(defaultTerms);
    }
  }, []);

  const addTerm = () => {
    onChange([...terms, { title: "", content: [""] }]);
    setExpandedIndex(terms.length);
  };

  const removeTerm = (index: number) => {
    if (terms.length > 1) {
      onChange(terms.filter((_, i) => i !== index));
      if (expandedIndex === index) {
        setExpandedIndex(null);
      } else if (expandedIndex !== null && expandedIndex > index) {
        setExpandedIndex(expandedIndex - 1);
      }
    }
  };

  const updateTermTitle = (index: number, title: string) => {
    const updated = terms.map((term, i) =>
      i === index ? { ...term, title } : term
    );
    onChange(updated);
  };

  const updateTermContent = (
    termIndex: number,
    contentIndex: number,
    content: string
  ) => {
    const updated = terms.map((term, i) => {
      if (i !== termIndex) return term;
      const newContent = [...term.content];
      newContent[contentIndex] = content;
      return { ...term, content: newContent };
    });
    onChange(updated);
  };

  const addContentLine = (termIndex: number) => {
    const updated = terms.map((term, i) => {
      if (i !== termIndex) return term;
      return { ...term, content: [...term.content, ""] };
    });
    onChange(updated);
  };

  const removeContentLine = (termIndex: number, contentIndex: number) => {
    const updated = terms.map((term, i) => {
      if (i !== termIndex) return term;
      if (term.content.length > 1) {
        return {
          ...term,
          content: term.content.filter((_, ci) => ci !== contentIndex),
        };
      }
      return term;
    });
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Rental Terms & Conditions
        </h3>
        <p className="text-sm text-gray-600">
          Define the terms and conditions for renting your car. This helps set
          clear expectations for renters.
        </p>
      </div>

      {/* Terms List */}
      <div className="space-y-4">
        {terms.map((term, termIndex) => (
          <div
            key={termIndex}
            className="border border-gray-200 rounded-xl overflow-hidden"
          >
            {/* Term Header */}
            <div
              className={`
                flex items-center gap-3 p-4 cursor-pointer
                ${expandedIndex === termIndex ? "bg-gray-50" : "bg-white"}
              `}
              onClick={() =>
                setExpandedIndex(expandedIndex === termIndex ? null : termIndex)
              }
            >
              <button
                type="button"
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center"
              >
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    expandedIndex === termIndex ? "rotate-90" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <div className="flex-1">
                <input
                  type="text"
                  value={term.title}
                  onChange={(e) => updateTermTitle(termIndex, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Term title (e.g., Driver Requirements)"
                  className="w-full bg-transparent font-medium text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </div>
              {terms.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTerm(termIndex);
                  }}
                  className="flex-shrink-0 text-gray-400 hover:text-red-500"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Term Content */}
            {expandedIndex === termIndex && (
              <div className="p-4 pt-0 space-y-3">
                {term.content.map((line, contentIndex) => (
                  <div key={contentIndex} className="flex items-center gap-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-500">
                      {contentIndex + 1}
                    </span>
                    <input
                      type="text"
                      value={line}
                      onChange={(e) =>
                        updateTermContent(
                          termIndex,
                          contentIndex,
                          e.target.value
                        )
                      }
                      placeholder={`Point ${contentIndex + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    {term.content.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeContentLine(termIndex, contentIndex)
                        }
                        className="flex-shrink-0 text-gray-400 hover:text-red-500"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addContentLine(termIndex)}
                  className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700"
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
                  Add point
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Term Button */}
      <button
        type="button"
        onClick={addTerm}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-teal-500 hover:text-teal-600 transition-colors flex items-center justify-center gap-2"
      >
        <svg
          className="w-5 h-5"
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
        Add New Term
      </button>

      {/* Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800">
              Tips for good terms
            </p>
            <ul className="text-sm text-blue-700 mt-1 list-disc list-inside">
              <li>Be clear and specific</li>
              <li>Include driver requirements (age, license)</li>
              <li>Mention fuel policy</li>
              <li>Specify mileage limits if any</li>
            </ul>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default TermsStep;
