import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CommonSelectOption = {
  id: string | number;
  name: string;
  value?: string;
};

type CommonSelectProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: CommonSelectOption[];
  required?: boolean;
  hasError?: boolean;
  hintText?: string;
  loading?: boolean;
  disabled?: boolean;
};

export function CommonSelect({
  label,
  value,
  onChange,
  placeholder,
  options,
  required,
  hasError,
  hintText,
  loading,
  disabled,
}: CommonSelectProps) {
  return (
    <div className="mb-3">
      {label && (
        <Label className="text-[#222] text-[14px] font-semibold mb-[6px] block">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Select
        value={value}
        onValueChange={onChange}
        disabled={loading || disabled}
      >
        <SelectTrigger
          className={`w-full h-[45px] px-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#222] focus:border-transparent ${
            hasError ? "border-[#FF7F7F]" : "border-[#F2F2F2]"
          } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <SelectValue placeholder={loading ? "Loading..." : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.id}
              value={String(option.value ?? option.id)}
            >
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hintText && (
        <p
          className={`mt-[6px] text-xs ${
            hasError ? "text-[#ba0606]" : "text-[#5A5A5A]"
          }`}
        >
          {hintText}
        </p>
      )}
    </div>
  );
}
