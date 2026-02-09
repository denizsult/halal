import { format } from "date-fns";
import { Calendar as CalendarIcon, Star, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useFilterModalController } from "./filter-modal.controller";
import type { FilterModalProps } from "./filter-modal.types";

export const FilterModal = ({ isOpen, onClose }: FilterModalProps) => {
  const {
    filters,
    setFilters,
    handleClearFilters,
    toggleRank,
    toggleLastUpdatedPreset,
    toggleRating,
    rankOptions,
    lastUpdatedOptions,
    ratingOptions,
  } = useFilterModalController();

  const handleShowResults = () => {
    console.log("Filters applied:", filters);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50" />

      <DialogContent
        showCloseButton={false}
        className="fixed top-6 right-6 left-auto translate-x-0 translate-y-0 z-50 w-[92vw] max-w-[520px] bg-white text-gray-900 rounded-3xl shadow-2xl p-0 overflow-hidden flex flex-col"
      >
        <div className="bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">
            Quick filters
          </h2>

          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-100 text-gray-700"
            aria-label="Close modal"
            tabIndex={0}
          >
            <X className="w-6 h-6" strokeWidth={2} />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <ScrollArea className="h-[400px] px-4 scrollbar-custom">
          <div className="space-y-6 px-2">
            {/* Customer Name */}
            <div className="space-y-2">
              <Label
                htmlFor="customerName"
                className="text-sm font-medium text-gray-900"
              >
                Customer name
              </Label>
              <Input
                id="customerName"
                type="text"
                placeholder="Search customers"
                value={filters.customerName}
                onChange={(e) =>
                  setFilters({ ...filters, customerName: e.target.value })
                }
                className="w-full bg-white text-gray-900 border-gray-200 rounded-xl placeholder:text-gray-400 focus-visible:border-brand-300 focus-visible:ring-brand-100 transition-all ease-in"
              />
            </div>

            {/* Rank */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-900">Rank</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.rankMin}
                  onChange={(e) =>
                    setFilters({ ...filters, rankMin: e.target.value })
                  }
                  className="w-full bg-white text-gray-900 border-gray-200 rounded-xl placeholder:text-gray-400 focus-visible:border-brand-300 focus-visible:ring-brand-100 transition-all ease-in"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.rankMax}
                  onChange={(e) =>
                    setFilters({ ...filters, rankMax: e.target.value })
                  }
                  className="w-full bg-white text-gray-900 border-gray-200 rounded-xl placeholder:text-gray-400 focus-visible:border-brand-300 focus-visible:ring-brand-100 transition-all ease-in"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {rankOptions.map((rank) => (
                  <button
                    key={rank}
                    type="button"
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out ${
                      filters.selectedRank === rank
                        ? "bg-brand-50 text-brand-700 border-brand-200"
                        : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => toggleRank(rank)}
                  >
                    {rank}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand & Car Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="brand"
                  className="text-sm font-medium text-gray-900"
                >
                  Brand
                </Label>
                <Select
                  value={filters.brand}
                  onValueChange={(value) =>
                    setFilters({ ...filters, brand: value })
                  }
                >
                  <SelectTrigger
                    id="brand"
                    className="w-full bg-white text-gray-900 border-gray-200 rounded-xl data-[placeholder]:text-gray-400 focus-visible:border-brand-300 focus-visible:ring-brand-100"
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-900 border-gray-200">
                    <SelectItem value="toyota">Toyota</SelectItem>
                    <SelectItem value="honda">Honda</SelectItem>
                    <SelectItem value="ford">Ford</SelectItem>
                    <SelectItem value="bmw">BMW</SelectItem>
                    <SelectItem value="mercedes">Mercedes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="carType"
                  className="text-sm font-medium text-gray-900"
                >
                  Car type
                </Label>
                <Select
                  value={filters.carType}
                  onValueChange={(value) =>
                    setFilters({ ...filters, carType: value })
                  }
                >
                  <SelectTrigger
                    id="carType"
                    className="w-full bg-white text-gray-900 border-gray-200 rounded-xl data-[placeholder]:text-gray-400 focus-visible:border-brand-300 focus-visible:ring-brand-100"
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-900 border-gray-200">
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="coupe">Coupe</SelectItem>
                    <SelectItem value="convertible">Convertible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Color & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="color"
                  className="text-sm font-medium text-gray-900"
                >
                  Color
                </Label>
                <Select
                  value={filters.color}
                  onValueChange={(value) =>
                    setFilters({ ...filters, color: value })
                  }
                >
                  <SelectTrigger
                    id="color"
                    className="w-full bg-white text-gray-900 border-gray-200 rounded-xl data-[placeholder]:text-gray-400 focus-visible:border-brand-300 focus-visible:ring-brand-100"
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-900 border-gray-200">
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="status"
                  className="text-sm font-medium text-gray-900"
                >
                  Status
                </Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) =>
                    setFilters({ ...filters, status: value })
                  }
                >
                  <SelectTrigger
                    id="status"
                    className="w-full bg-white text-gray-900 border-gray-200 rounded-xl data-[placeholder]:text-gray-400 focus-visible:border-brand-300 focus-visible:ring-brand-100"
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-900 border-gray-200">
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label
                htmlFor="date"
                className="text-sm font-medium text-gray-900"
              >
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    id="date"
                    type="button"
                    className="w-full bg-white text-gray-900 border border-gray-200 rounded-xl px-3 py-2 text-sm text-left flex items-center justify-between gap-3 hover:bg-gray-50 focus:outline-none focus-visible:border-brand-300 focus-visible:ring-2 focus-visible:ring-brand-100 transition-all ease-in"
                  >
                    <span
                      className={
                        filters.date ? "text-gray-900" : "text-gray-400"
                      }
                    >
                      {filters.date
                        ? format(filters.date, "MMM d, yyyy")
                        : "Choose date"}
                    </span>
                    <CalendarIcon className="size-5 text-gray-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  sideOffset={8}
                  className="w-auto p-0 bg-white border border-gray-200 shadow-md"
                >
                  <Calendar
                    mode="single"
                    selected={filters.date ?? undefined}
                    onSelect={(date) =>
                      setFilters({ ...filters, date: date ?? null })
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label
                htmlFor="time"
                className="text-sm font-medium text-gray-900"
              >
                Time
              </Label>
              <Input
                id="time"
                type="text"
                placeholder="Choose time"
                value={filters.time}
                onChange={(e) =>
                  setFilters({ ...filters, time: e.target.value })
                }
                className="w-full bg-white text-gray-900 border-gray-200 rounded-xl placeholder:text-gray-400 focus-visible:border-brand-300 focus-visible:ring-brand-100 transition-all ease-in"
              />
            </div>

            {/* Last Updated */}
            <div className="space-y-3">
              <Label
                htmlFor="lastUpdated"
                className="text-sm font-medium text-gray-900"
              >
                Last updated
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    id="lastUpdated"
                    type="button"
                    className="w-full bg-white text-gray-900 border border-gray-200 rounded-xl px-3 py-2 text-sm text-left flex items-center justify-between gap-3 hover:bg-gray-50 focus:outline-none focus-visible:border-brand-300 focus-visible:ring-2 focus-visible:ring-brand-100 transition-all ease-in"
                  >
                    <span
                      className={
                        filters.lastUpdated ? "text-gray-900" : "text-gray-400"
                      }
                    >
                      {filters.lastUpdated
                        ? format(filters.lastUpdated, "MMM d, yyyy")
                        : "Choose date"}
                    </span>
                    <CalendarIcon className="size-5 text-gray-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  sideOffset={8}
                  className="w-auto p-0 bg-white border border-gray-200 shadow-md"
                >
                  <Calendar
                    mode="single"
                    selected={filters.lastUpdated ?? undefined}
                    onSelect={(date) =>
                      setFilters({ ...filters, lastUpdated: date ?? null })
                    }
                  />
                </PopoverContent>
              </Popover>
              <div className="flex flex-wrap gap-2">
                {lastUpdatedOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out ${
                      filters.lastUpdatedPreset === option
                        ? "bg-brand-50 text-brand-700 border-brand-200"
                        : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => toggleLastUpdatedPreset(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-900">Price</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin}
                  onChange={(e) =>
                    setFilters({ ...filters, priceMin: e.target.value })
                  }
                  className="w-full bg-white text-gray-900 border-gray-200 rounded-xl placeholder:text-gray-400 focus-visible:border-brand-300 focus-visible:ring-brand-100 transition-all ease-in"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax}
                  onChange={(e) =>
                    setFilters({ ...filters, priceMax: e.target.value })
                  }
                  className="w-full bg-white text-gray-900 border-gray-200 rounded-xl placeholder:text-gray-400 focus-visible:border-brand-300 focus-visible:ring-brand-100 transition-all ease-in"
                />
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-900">
                Rating
              </Label>
              <div className="flex flex-wrap gap-2">
                {ratingOptions.map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out flex items-center gap-2 ${
                      filters.rating === rating
                        ? "bg-brand-50 text-brand-700 border-brand-200"
                        : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => toggleRating(rating)}
                  >
                    <span>
                      {rating} {rating === 1 ? "star" : "stars"}
                    </span>
                    <span className="flex items-center gap-1">
                      {Array.from({ length: rating }).map((_, index) => (
                        <Star
                          key={index}
                          className="size-4 text-orange-400 fill-orange-400"
                        />
                      ))}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Modal Footer - Fixed */}
        <div className="sticky bottom-0 z-10 bg-white border-t border-gray-100 px-6 py-5 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
          <Button
            onClick={handleClearFilters}
            variant="outline"
            className="w-full sm:w-auto rounded-full bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 font-normal px-6 py-3"
          >
            Clear filter
          </Button>
          <Button
            onClick={handleShowResults}
            className="w-full sm:w-auto rounded-full font-semibold px-6 py-3"
          >
            Show 48 results
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
