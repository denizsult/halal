import { useState } from 'react';

import { defaultFilters, lastUpdatedOptions, rankOptions, ratingOptions } from './filter-modal.defaults';
import type { FilterState } from './filter-modal.types';

const cloneDefaultFilters = () => ({ ...defaultFilters });

const useFilterModalController = () => {
  const [filters, setFilters] = useState<FilterState>(cloneDefaultFilters());

  const handleClearFilters = () => {
    setFilters(cloneDefaultFilters());
  };

  const toggleRank = (rank: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedRank: prev.selectedRank === rank ? '' : rank,
    }));
  };

  const toggleLastUpdatedPreset = (preset: string) => {
    setFilters((prev) => ({
      ...prev,
      lastUpdatedPreset: prev.lastUpdatedPreset === preset ? '' : preset,
    }));
  };

  const toggleRating = (rating: number) => {
    setFilters((prev) => ({
      ...prev,
      rating: prev.rating === rating ? null : rating,
    }));
  };

  return {
    filters,
    setFilters,
    handleClearFilters,
    toggleRank,
    toggleLastUpdatedPreset,
    toggleRating,
    rankOptions,
    lastUpdatedOptions,
    ratingOptions,
  };
};

export { useFilterModalController };
