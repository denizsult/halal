"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuthStore } from "@/stores/auth.store";

import { WizardForm } from "../listings-add/components/wizard";
import { getApiService } from "../listings-add/services";
import type { ServiceType } from "../listings-add/types";

export default function ListingsEditPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [initialData, setInitialData] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const serviceType = (user?.company?.type as ServiceType) || "rent_a_car";

  useEffect(() => {
    async function fetchListing() {
      if (!id) return;
      try {
        const apiService = getApiService(serviceType);
        const data = await apiService.getListing(Number(id));
        setInitialData(data);
      } catch (err) {
        console.error("Failed to fetch listing:", err);
        setError("Failed to load listing data.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchListing();
  }, [id, serviceType]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Listing not found"}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-teal-600 hover:underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <WizardForm
      serviceType={serviceType}
      appUserId={user?.id}
      initialData={initialData}
      listingId={Number(id)}
    />
  );
}
