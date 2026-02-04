"use client";

import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FilterRangeFieldProps {
  label: string;
  minField: string;
  maxField: string;
}

export function FilterRangeField({
  label,
  minField,
  maxField,
}: FilterRangeFieldProps) {
  const { register } = useFormContext();

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-900">{label}</Label>
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          placeholder="Min"
          {...register(minField)}
          className="w-full bg-white text-gray-900 border-gray-200 rounded-xl placeholder:text-gray-400 focus-visible:border-brand-300 focus-visible:ring-brand-100 transition-all ease-in"
        />
        <Input
          type="number"
          placeholder="Max"
          {...register(maxField)}
          className="w-full bg-white text-gray-900 border-gray-200 rounded-xl placeholder:text-gray-400 focus-visible:border-brand-300 focus-visible:ring-brand-100 transition-all ease-in"
        />
      </div>
    </div>
  );
}
