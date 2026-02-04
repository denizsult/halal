export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface FilterState {
  customerName: string;
  rankMin: string;
  rankMax: string;
  selectedRank: string;
  brand: string;
  carType: string;
  color: string;
  status: string;
  date: Date | null;
  time: string;
  lastUpdated: Date | null;
  lastUpdatedPreset: string;
  priceMin: string;
  priceMax: string;
  rating: number | null;
}
