"use client";

import { useEffect, useState } from "react";

export interface TransferOffer {
  discount_price: number;
  start_date: string;
  end_date: string;
}

export interface TransferPricing {
  low_price: number;
  medium_price: number;
  high_price: number;
  early_booking_discount_percentage: number;
  transfer_offers: TransferOffer[];
}

interface PricingStepProps {
  value: TransferPricing | undefined;
  onChange: (value: TransferPricing) => void;
  error?: string;
  fieldErrors?: Record<string, { message?: string }>;
}

const defaultPricing: TransferPricing = {
  low_price: 0,
  medium_price: 0,
  high_price: 0,
  early_booking_discount_percentage: 0,
  transfer_offers: [],
};

function PricingStep({
  value,
  onChange,
  error,
  fieldErrors,
}: PricingStepProps) {
  const pricing = value ?? defaultPricing;
  const [showOffers, setShowOffers] = useState(
    pricing.transfer_offers.length > 0
  );

  useEffect(() => {
    if (!value) {
      onChange(defaultPricing);
    }
  }, []);

  const updatePrice = (
    key: keyof Pick<
      TransferPricing,
      "low_price" | "medium_price" | "high_price"
    >,
    amount: number
  ) => {
    const newValue = Math.max(0, (pricing[key] || 0) + amount);
    onChange({ ...pricing, [key]: newValue });
  };

  const updateDiscount = (percentage: number) => {
    onChange({
      ...pricing,
      early_booking_discount_percentage: Math.min(100, Math.max(0, percentage)),
    });
  };

  const addOffer = () => {
    const newOffer: TransferOffer = {
      discount_price: 0,
      start_date: "",
      end_date: "",
    };
    onChange({
      ...pricing,
      transfer_offers: [...pricing.transfer_offers, newOffer],
    });
  };

  const updateOffer = (
    index: number,
    field: keyof TransferOffer,
    fieldValue: string | number
  ) => {
    const updatedOffers = pricing.transfer_offers.map((offer, i) =>
      i === index ? { ...offer, [field]: fieldValue } : offer
    );
    onChange({ ...pricing, transfer_offers: updatedOffers });
  };

  const removeOffer = (index: number) => {
    onChange({
      ...pricing,
      transfer_offers: pricing.transfer_offers.filter((_, i) => i !== index),
    });
  };

  // Calculate commission (25% for transfer)
  const commission = 0.25;
  const priceAfterDiscount =
    pricing.medium_price *
    (1 - pricing.early_booking_discount_percentage / 100);
  const priceAfterCommission = priceAfterDiscount * (1 - commission);

  return (
    <div className="space-y-6">
      {/* Price Tiers */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Set Your Prices</h3>
        <p className="text-sm text-gray-600">
          Set different prices for low, medium, and high demand periods.
        </p>

        <div className="grid grid-cols-3 gap-4">
          {/* Low Demand */}
          <div
            className={`p-4 bg-blue-50 rounded-xl border ${
              fieldErrors?.low_price ? "border-red-400" : "border-blue-100"
            }`}
          >
            <div className="text-sm font-medium text-blue-800 mb-2">
              Low Demand
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updatePrice("low_price", -10)}
                className="w-8 h-8 bg-white rounded-full border flex items-center justify-center hover:bg-blue-100"
              >
                -
              </button>
              <div className="flex-1 text-center">
                <span className="text-2xl font-bold text-blue-900">
                  ${pricing.low_price}
                </span>
                <span className="text-sm text-blue-600">/day</span>
              </div>
              <button
                type="button"
                onClick={() => updatePrice("low_price", 10)}
                className="w-8 h-8 bg-white rounded-full border flex items-center justify-center hover:bg-blue-100"
              >
                +
              </button>
            </div>
            {fieldErrors?.low_price?.message && (
              <p className="text-xs text-red-500 mt-2">
                {fieldErrors.low_price.message}
              </p>
            )}
          </div>

          {/* Medium Demand */}
          <div
            className={`p-4 bg-amber-50 rounded-xl border ${
              fieldErrors?.medium_price ? "border-red-400" : "border-amber-100"
            }`}
          >
            <div className="text-sm font-medium text-amber-800 mb-2">
              Medium Demand
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updatePrice("medium_price", -10)}
                className="w-8 h-8 bg-white rounded-full border flex items-center justify-center hover:bg-amber-100"
              >
                -
              </button>
              <div className="flex-1 text-center">
                <span className="text-2xl font-bold text-amber-900">
                  ${pricing.medium_price}
                </span>
                <span className="text-sm text-amber-600">/day</span>
              </div>
              <button
                type="button"
                onClick={() => updatePrice("medium_price", 10)}
                className="w-8 h-8 bg-white rounded-full border flex items-center justify-center hover:bg-amber-100"
              >
                +
              </button>
            </div>
            {fieldErrors?.medium_price?.message && (
              <p className="text-xs text-red-500 mt-2">
                {fieldErrors.medium_price.message}
              </p>
            )}
          </div>

          {/* High Demand */}
          <div
            className={`p-4 bg-red-50 rounded-xl border ${
              fieldErrors?.high_price ? "border-red-400" : "border-red-100"
            }`}
          >
            <div className="text-sm font-medium text-red-800 mb-2">
              High Demand
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updatePrice("high_price", -10)}
                className="w-8 h-8 bg-white rounded-full border flex items-center justify-center hover:bg-red-100"
              >
                -
              </button>
              <div className="flex-1 text-center">
                <span className="text-2xl font-bold text-red-900">
                  ${pricing.high_price}
                </span>
                <span className="text-sm text-red-600">/day</span>
              </div>
              <button
                type="button"
                onClick={() => updatePrice("high_price", 10)}
                className="w-8 h-8 bg-white rounded-full border flex items-center justify-center hover:bg-red-100"
              >
                +
              </button>
            </div>
            {fieldErrors?.high_price?.message && (
              <p className="text-xs text-red-500 mt-2">
                {fieldErrors.high_price.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Early Booking Discount */}
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-medium text-gray-900">
              Early Booking Discount
            </h4>
            <p className="text-sm text-gray-600">
              Attract more customers with an early booking discount
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={100}
              value={pricing.early_booking_discount_percentage}
              onChange={(e) => updateDiscount(Number(e.target.value))}
              className="w-20 px-3 py-2 border rounded-lg text-center"
            />
            <span className="text-gray-600">%</span>
          </div>
        </div>

        {/* Price Summary */}
        <div className="space-y-2 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Original price</span>
            <span className="font-medium">${pricing.medium_price}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">After discount</span>
            <span className="font-medium text-green-600">
              ${priceAfterDiscount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Commission (25%)</span>
            <span className="font-medium text-red-600">
              -${(priceAfterDiscount * commission).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
            <span className="font-medium text-gray-900">You earn</span>
            <span className="font-bold text-teal-600">
              ${priceAfterCommission.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Special Offers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-medium text-gray-900">Special Offers</h4>
            <p className="text-sm text-gray-600">
              Create time-limited discounts for specific periods
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowOffers(!showOffers)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              showOffers ? "bg-teal-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                showOffers ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>

        {showOffers && (
          <div className="space-y-4">
            {pricing.transfer_offers.map((offer, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-xl border border-gray-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">
                    Offer {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeOffer(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">
                      Discount Price
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={offer.discount_price}
                      onChange={(e) =>
                        updateOffer(
                          index,
                          "discount_price",
                          Number(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Start Date</label>
                    <input
                      type="date"
                      value={offer.start_date}
                      onChange={(e) =>
                        updateOffer(index, "start_date", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">End Date</label>
                    <input
                      type="date"
                      value={offer.end_date}
                      onChange={(e) =>
                        updateOffer(index, "end_date", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addOffer}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-teal-500 hover:text-teal-600 transition-colors"
            >
              + Add Special Offer
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default PricingStep;
