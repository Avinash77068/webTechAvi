"use client";

import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { adsEnabled } from "@/lib/ads-config";

const CONSENT_STORAGE_KEY = "techsutra-ad-consent";

type ConsentChoice = "accepted" | "rejected" | null;

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

function setConsent(choice: "accepted" | "rejected") {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  for (const listener of listeners) listener();
}

/**
 * Consent banner for ad personalization. Inert while `adsEnabled` is false — there is
 * no ad provider to consent to yet. Wire this up when a real, approved provider ships.
 */
export function AdConsent() {
  const choice = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!adsEnabled || choice !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Advertising consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card p-4 shadow-lg"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          We use advertising to keep TechSutra free. Allow personalized ads, or continue with
          non-personalized ads only.
        </p>
        <div className="flex shrink-0 gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setConsent("rejected")}>
            Non-personalized only
          </Button>
          <Button type="button" size="sm" onClick={() => setConsent("accepted")}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
