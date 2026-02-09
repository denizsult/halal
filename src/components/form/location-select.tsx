import { useEffect, useRef, useState } from "react";
import { CheckIcon, ChevronsUpDownIcon, MapPin, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLocationAutocomplete } from "@/features/commons/api/useLocationAutocomplete";
import { useLocationDetails } from "@/features/commons/api/useLocationDetails";
import { cn } from "@/lib/utils";

export type LocationValue = {
  place_id: string;
  name: string;
  formatted_address: string;
  latitude: number;
  longitude: number;
} | null;

type LocationSelectProps = {
  label?: string;
  value: LocationValue;
  onChange: (value: LocationValue) => void;
  placeholder?: string;
  required?: boolean;
  hasError?: boolean;
  hintText?: string;
  disabled?: boolean;
};

export function LocationSelect({
  label = "Location",
  value,
  onChange,
  placeholder = "Search for a location...",
  required,
  hasError,
  hintText,
  disabled,
}: LocationSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounce search input
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timerRef.current);
  }, [search]);

  const { data: predictions = [], isFetching } =
    useLocationAutocomplete(debouncedSearch);

  // Fetch details when a place is selected
  const { data: placeDetails } = useLocationDetails(selectedPlaceId ?? "");

  // When placeDetails arrives, call onChange with full data
  useEffect(() => {
    if (placeDetails && selectedPlaceId) {
      onChange({
        place_id: selectedPlaceId,
        name: placeDetails.name,
        formatted_address: placeDetails.formatted_address,
        latitude: placeDetails.latitude,
        longitude: placeDetails.longitude,
      });
      setSelectedPlaceId(null);
      setSearch("");
      setOpen(false);
    }
  }, [placeDetails, selectedPlaceId, onChange]);

  const handleSelect = (placeId: string) => {
    setSelectedPlaceId(placeId);
  };

  const handleClear = () => {
    onChange(null);
    setSearch("");
  };

  const displayValue = value?.name
    ? `${value.name}${value.formatted_address ? ` — ${value.formatted_address}` : ""}`
    : null;

  return (
    <div className="mb-3">
      {label && (
        <Label className="text-[#222] text-[14px] font-semibold mb-[6px] block">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      {value ? (
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-2 h-[45px] rounded-lg border bg-white",
            hasError ? "border-[#FF7F7F]" : "border-[#F2F2F2]"
          )}
        >
          <MapPin className="h-4 w-4 text-brand-500 shrink-0" />
          <span className="text-sm truncate flex-1">{displayValue}</span>
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={disabled}
              className={cn(
                "w-full h-[45px] px-3 py-2 text-sm font-normal justify-between rounded-lg bg-white border hover:bg-white hover:border-[#222]/20",
                hasError ? "border-[#FF7F7F]" : "border-[#F2F2F2]",
                "text-muted-foreground"
              )}
            >
              <span className="flex items-center gap-2 truncate">
                <MapPin className="h-4 w-4 shrink-0" />
                {placeholder}
              </span>
              <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0"
            align="start"
          >
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Type to search..."
                className="h-9"
                value={search}
                onValueChange={setSearch}
              />
              <CommandList>
                <CommandEmpty>
                  {isFetching
                    ? "Searching..."
                    : debouncedSearch.length < 2
                      ? "Type at least 2 characters..."
                      : "No locations found."}
                </CommandEmpty>
                <CommandGroup>
                  {predictions.map((prediction) => (
                    <CommandItem
                      key={prediction.place_id}
                      value={prediction.place_id}
                      onSelect={() => handleSelect(prediction.place_id)}
                    >
                      <CheckIcon className="mr-2 size-4 opacity-0" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {prediction.main_text}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {prediction.secondary_text}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {hintText && (
        <p
          className={cn(
            "mt-[6px] text-xs",
            hasError ? "text-[#ba0606]" : "text-[#5A5A5A]"
          )}
        >
          {hintText}
        </p>
      )}
    </div>
  );
}
