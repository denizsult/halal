"use client";

import { useCallback, useMemo, useState } from "react";

import { useBrands } from "@/features/commons/api/useBrands";
import { useCities } from "@/features/commons/api/useCities";
import { useCountries } from "@/features/commons/api/useCountries";
import { useFeatures } from "@/features/commons/api/useFeatures";
import { useModels } from "@/features/commons/api/useModels";

import type { DynamicOptions, FieldOption } from "../types";

export function useDynamicOptions() {
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
    null
  );

  const {
    data: brandsData = [],
    isLoading: isBrandsLoading,
    isFetching: isBrandsFetching,
    error: brandsError,
    refetch: refetchBrands,
  } = useBrands();

  const {
    data: modelsData = [],
    isLoading: isModelsLoading,
    isFetching: isModelsFetching,
    error: modelsError,
    refetch: refetchModels,
  } = useModels({
    brandId: selectedBrandId ?? 0,
  });

  const {
    data: countriesData = [],
    isLoading: isCountriesLoading,
    isFetching: isCountriesFetching,
    error: countriesError,
    refetch: refetchCountries,
  } = useCountries();

  const {
    data: citiesData = [],
    isLoading: isCitiesLoading,
    isFetching: isCitiesFetching,
    error: citiesError,
    refetch: refetchCities,
  } = useCities({
    countryId: selectedCountryId ?? 0,
    enabled: !!selectedCountryId,
  });

  const {
    data: featuresData = [],
    isLoading: isFeaturesLoading,
    isFetching: isFeaturesFetching,
    error: featuresError,
    refetch: refetchFeatures,
  } = useFeatures();

  const toFieldOptions = useCallback(
    <T extends { id: number; name: string }>(items: T[]): FieldOption[] =>
      items.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    []
  );

  const brands = useMemo(
    () => toFieldOptions(brandsData),
    [brandsData, toFieldOptions]
  );
  const models = useMemo(
    () => (selectedBrandId ? toFieldOptions(modelsData) : []),
    [modelsData, selectedBrandId, toFieldOptions]
  );
  const countries = useMemo(
    () => toFieldOptions(countriesData),
    [countriesData, toFieldOptions]
  );
  const cities = useMemo(
    () => (selectedCountryId ? toFieldOptions(citiesData) : []),
    [citiesData, selectedCountryId, toFieldOptions]
  );
  const features = useMemo(
    () => toFieldOptions(featuresData),
    [featuresData, toFieldOptions]
  );

  const isLoading =
    isBrandsLoading ||
    isBrandsFetching ||
    isModelsLoading ||
    isModelsFetching ||
    isCountriesLoading ||
    isCountriesFetching ||
    isCitiesLoading ||
    isCitiesFetching ||
    isFeaturesLoading ||
    isFeaturesFetching;

  const error =
    brandsError?.message ||
    modelsError?.message ||
    countriesError?.message ||
    citiesError?.message ||
    featuresError?.message ||
    null;

  const updateSelectedBrand = useCallback((brandId: number | null) => {
    setSelectedBrandId(brandId);
  }, []);

  const updateSelectedCountry = useCallback((countryId: number | null) => {
    setSelectedCountryId(countryId);
  }, []);

  const options: DynamicOptions = {
    brands,
    models,
    countries,
    cities,
    features,
    isLoading,
    error,
  };

  return {
    ...options,
    updateSelectedBrand,
    updateSelectedCountry,
    refetchBrands,
    refetchModels,
    refetchCountries,
    refetchFeatures,
    refetchCities,
  };
}

export type UseDynamicOptionsReturn = ReturnType<typeof useDynamicOptions>;
