import type { ServiceType } from "./types";

const DRAFT_PREFIX = "listing-wizard";

export const getListingDraftPersistKey = (serviceType: ServiceType) =>
  `add:${serviceType}`;

export const getListingDraftStorageKey = (persistKey?: string | null) =>
  persistKey ? `${DRAFT_PREFIX}:${persistKey}` : null;

export const getListingDraftStorageKeyForService = (serviceType: ServiceType) =>
  `${DRAFT_PREFIX}:${getListingDraftPersistKey(serviceType)}`;

export const readListingDraft = (storageKey: string) => {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as {
      values?: Record<string, unknown>;
      currentStep?: number;
      entityId?: number | null;
    };
  } catch {
    return null;
  }
};

export const hasListingDraft = (storageKey: string) => {
  const data = readListingDraft(storageKey);
  if (!data) return false;
  const values = data.values ?? {};
  return Object.keys(values).length > 0;
};

export const clearListingDraft = (storageKey: string) => {
  localStorage.removeItem(storageKey);
};
