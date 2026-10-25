"use client";

import Script from "next/script";
import { Button } from "@/components/ui/button";
import { adsEnabled, adsensePublisherId } from "@/lib/ads-config";
import { setAdConsent, useAdConsent } from "@/lib/ad-consent";

export function AdConsent() {
  const choice = useAdConsent();

  if (!adsEnabled) return null;

  return (
    <>
      {choice !== null && (
        <Script
          id="google-adsense"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      )}
      {choice === null && (
        <div
          role="dialog"
          aria-label="Advertising consent"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card p-4 shadow-lg"
        >
          <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              We use Google AdSense to support TechSutra. Allow personalized ads, or continue
              with non-personalized ads only.
            </p>
            <div className="flex shrink-0 gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setAdConsent("rejected")}>
                Non-personalized only
              </Button>
              <Button type="button" size="sm" onClick={() => setAdConsent("accepted")}>
                Accept
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
