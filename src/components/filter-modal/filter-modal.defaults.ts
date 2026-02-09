import type { FilterState } from './filter-modal.types';

export const defaultFilters: FilterState = {
  customerName: '',
  rankMin: '',
  rankMax: '',
  selectedRank: '',
  brand: '',
  carType: '',
  color: '',
  status: '',
  date: null,
  time: '',
  lastUpdated: null,
  lastUpdatedPreset: '',
  priceMin: '',
  priceMax: '',
  rating: null,
};

export const rankOptions = ['Top 10', '11-50', '51+'] as const;
export const lastUpdatedOptions = [
  'Today',
  'Last 7 days',
  'Last 30 days',
  'Last 1 month',
  'Last 3 month',
  'Last 6 month',
] as const;
export const ratingOptions = [1, 2, 3, 4, 5] as const;
