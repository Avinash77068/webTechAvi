"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  adsEnabled,
  adsensePublisherId,
  adPlacementConfig,
  type AdPlacement,
} from "@/lib/ads-config";
import { AdPlaceholder } from "@/components/ads/ad-placeholder";

export function AdSlot({ placement, className }: { placement: AdPlacement; className?: string }) {
  const adConfig = adPlacementConfig[placement];
  const adRef = useRef<HTMLModElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!adsEnabled || !adRef.current || initialized.current) return;

    const adsbygoogle = (window.adsbygoogle = window.adsbygoogle || []);
    adsbygoogle.push({});
    initialized.current = true;
  }, []);

  if (!adsEnabled) {
    if (process.env.NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS === "true") {
      return (
        <div className={className}>
          <AdPlaceholder width={adConfig.width} height={adConfig.height} />
        </div>
      );
    }
    return null;
  }

  return (
    <div
      data-ad-placement={placement}
      style={{ minHeight: adConfig.height, maxWidth: adConfig.width }}
      className={cn("mx-auto w-full", className)}
    >
      <ins
        ref={adRef}
        className="adsbygoogle block w-full"
        style={{ display: "block" }}
        data-ad-client={adsensePublisherId}
        data-ad-slot={adConfig.slotId}
        data-ad-format={adConfig.format}
        data-ad-layout-key={adConfig.layoutKey}
        data-full-width-responsive={adConfig.fullWidthResponsive ? "true" : undefined}
      />
    </div>
  );
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, never>> & {
      requestNonPersonalizedAds?: number;
    };
  }
}
