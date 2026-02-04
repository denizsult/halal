"use client";

import { useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import type { CarCalendar } from "../../../types";

interface CalendarStepProps {
  value: CarCalendar | undefined;
  onChange: (value: CarCalendar) => void;
  error?: string;
}

const defaultCalendar: CarCalendar = {
  start_date: null,
  end_date: null,
  is_all_day: false,
  unavailable_reason: null,
};

const unavailableReasons = [
  { id: 1, name: "Personal use" },
  { id: 2, name: "Maintenance" },
  { id: 3, name: "Already booked" },
  { id: 4, name: "Other" },
];

const parseDate = (value: string | null | undefined): Date | undefined => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const toYmd = (date: Date | undefined): string | null => {
  if (!date) return null;
  return format(date, "yyyy-MM-dd");
};

function CalendarStep({ value, onChange, error }: CalendarStepProps) {
  const calendar = value ?? defaultCalendar;

  // Initialize form with default values if not set
  useEffect(() => {
    if (value == null) {
      onChange(defaultCalendar);
    }
  }, [onChange, value]);

  const updateField = <K extends keyof CarCalendar>(
    field: K,
    fieldValue: CarCalendar[K]
  ) => {
    onChange({ ...calendar, [field]: fieldValue });
  };

  const startDate = parseDate(calendar.start_date);
  const endDate = parseDate(calendar.end_date);

  return (
    <div className="space-y-6">
      {/* Availability Period */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Availability Period
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Set the dates when your car will be available for rent.
        </p>

        <div className="grid grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-xl border-gray-200 bg-gray-50 hover:bg-white",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(d) => {
                    updateField("start_date", toYmd(d));
                    // If end date is before start date, clear it.
                    if (d && endDate && endDate < d) {
                      updateField("end_date", null);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={!startDate}
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-xl border-gray-200 bg-gray-50 hover:bg-white",
                    !endDate && "text-muted-foreground",
                    !startDate && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  fromDate={startDate}
                  onSelect={(d) => updateField("end_date", toYmd(d))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* All Day Option */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div>
          <h4 className="font-medium text-gray-900">Available All Day</h4>
          <p className="text-sm text-gray-600">
            Your car can be picked up and returned at any time
          </p>
        </div>
        <button
          type="button"
          onClick={() => updateField("is_all_day", !calendar.is_all_day)}
          className={`
            relative w-12 h-6 rounded-full transition-colors
            ${calendar.is_all_day ? "bg-teal-600" : "bg-gray-200"}
          `}
        >
          <span
            className={`
              absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
              ${calendar.is_all_day ? "left-7" : "left-1"}
            `}
          />
        </button>
      </div>

      {/* Unavailable Reason */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">
          Unavailable Reason (Optional)
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          If there are specific dates your car won&apos;t be available, select a
          reason.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {unavailableReasons.map((reason) => (
            <button
              key={reason.id}
              type="button"
              onClick={() =>
                updateField(
                  "unavailable_reason",
                  calendar.unavailable_reason === reason.id ? null : reason.id
                )
              }
              className={`
                px-4 py-3 rounded-xl border text-sm font-medium transition-all
                ${
                  calendar.unavailable_reason === reason.id
                    ? "bg-teal-50 border-teal-500 text-teal-700"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }
              `}
            >
              {reason.name}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Preview */}
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800">
              Availability Summary
            </p>
            <p className="text-sm text-blue-700 mt-1">
              {calendar.start_date && calendar.end_date ? (
                <>
                  Your car will be available from{" "}
                  <strong>
                    {new Date(calendar.start_date).toLocaleDateString()}
                  </strong>{" "}
                  to{" "}
                  <strong>
                    {new Date(calendar.end_date).toLocaleDateString()}
                  </strong>
                  {calendar.is_all_day && " (all day)"}
                </>
              ) : (
                "Please select your availability dates"
              )}
            </p>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default CalendarStep;
