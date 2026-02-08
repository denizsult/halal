"use client";

import { proxy, useSnapshot } from "valtio";

type WizardUiState = {
  subStepById: Record<string, number>;
  completedSubStepById: Record<string, number>;
};

export const wizardUiState = proxy<WizardUiState>({
  subStepById: {},
  completedSubStepById: {},
});

export function useWizardUiSnapshot() {
  return useSnapshot(wizardUiState);
}

export function getSubStepIndex(stepId: string) {
  return wizardUiState.subStepById[stepId] ?? 0;
}

export function setSubStepIndex(stepId: string, index: number) {
  wizardUiState.subStepById[stepId] = index;
}

export function hasSubStepIndex(stepId: string) {
  return stepId in wizardUiState.subStepById;
}

export function getCompletedSubStepIndex(stepId: string) {
  return wizardUiState.completedSubStepById[stepId] ?? -1;
}

export function setCompletedSubStepIndex(stepId: string, index: number) {
  wizardUiState.completedSubStepById[stepId] = index;
}

export function hasCompletedSubStepIndex(stepId: string) {
  return stepId in wizardUiState.completedSubStepById;
}

const getUiStorageKey = (storageKey: string) => `${storageKey}:ui`;

export function loadWizardUiState(storageKey: string) {
  const raw = localStorage.getItem(getUiStorageKey(storageKey));
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw) as WizardUiState;
    wizardUiState.subStepById = parsed.subStepById ?? {};
    wizardUiState.completedSubStepById = parsed.completedSubStepById ?? {};
  } catch {
    localStorage.removeItem(getUiStorageKey(storageKey));
  }
}

export function persistWizardUiState(storageKey: string) {
  localStorage.setItem(
    getUiStorageKey(storageKey),
    JSON.stringify({
      subStepById: wizardUiState.subStepById,
      completedSubStepById: wizardUiState.completedSubStepById,
    })
  );
}

export function clearWizardUiState(storageKey: string) {
  localStorage.removeItem(getUiStorageKey(storageKey));
  wizardUiState.subStepById = {};
  wizardUiState.completedSubStepById = {};
}
