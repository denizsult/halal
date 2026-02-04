"use client";

import { useState } from "react";
import { Controller,useFormContext } from "react-hook-form";

interface LocationFieldProps {
  name: string;
  label: string;
  required?: boolean;
  helpText?: string;
  disabled?: boolean;
}

// Mock locations - in real implementation, this would come from an API
const mockLocations = [
  { id: 1, name: "Istanbul Airport (IST)" },
  { id: 2, name: "Sabiha Gokcen Airport (SAW)" },
  { id: 3, name: "Antalya Airport (AYT)" },
  { id: 4, name: "Izmir Airport (ADB)" },
  { id: 5, name: "Ankara Airport (ESB)" },
];

export function LocationField({
  name,
  label,
  required,
  helpText,
  disabled,
}: LocationFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message as string | undefined;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLocations = mockLocations.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedLocation = mockLocations.find(
            (loc) => loc.id === field.value
          );

          return (
            <div className="space-y-2">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for a location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={disabled}
                  className={`
                    w-full px-4 py-3 rounded-xl border bg-gray-50
                    text-sm transition-colors
                    focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                    ${error ? "border-red-500" : "border-gray-200"}
                    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                />
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>

              {/* Selected Location */}
              {selectedLocation && (
                <div className="flex items-center gap-2 px-4 py-3 bg-teal-50 border border-teal-200 rounded-xl">
                  <svg
                    className="w-5 h-5 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm font-medium text-teal-700">
                    {selectedLocation.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => field.onChange(null)}
                    className="ml-auto text-teal-600 hover:text-teal-800"
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
                </div>
              )}

              {/* Location Options */}
              {searchQuery && !selectedLocation && (
                <div className="border rounded-xl overflow-hidden divide-y divide-gray-100">
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((location) => (
                      <button
                        key={location.id}
                        type="button"
                        onClick={() => {
                          field.onChange(location.id);
                          setSearchQuery("");
                        }}
                        disabled={disabled}
                        className={`
                          w-full px-4 py-3 text-left text-sm
                          hover:bg-gray-50 transition-colors
                          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                          </svg>
                          {location.name}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No locations found
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }}
      />
      {helpText && !error && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
