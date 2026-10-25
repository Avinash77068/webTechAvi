"use client";

import { useSyncExternalStore } from "react";

const CONSENT_STORAGE_KEY = "techsutra-ad-consent";

export type ConsentChoice = "accepted" | "rejected" | null;

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): ConsentChoice {
  const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  return stored === "accepted" || stored === "rejected" ? stored : null;
}

function getServerSnapshot(): ConsentChoice {
  return null;
}

export function useAdConsent() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setAdConsent(choice: Exclude<ConsentChoice, null>) {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  for (const listener of listeners) listener();
}
