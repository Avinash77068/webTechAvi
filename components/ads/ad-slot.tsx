import { cn } from "@/lib/utils";
import { adsEnabled, adPlacementSizes, type AdPlacement } from "@/lib/ads-config";
import { AdPlaceholder } from "@/components/ads/ad-placeholder";

/**
 * Reserves space for a future ad unit at `placement`. Renders nothing visible until
 * a real, approved ad provider is wired up — never a fake or simulated ad. Set
 * NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS=true locally to preview reserved layout space.
 */
export function AdSlot({ placement, className }: { placement: AdPlacement; className?: string }) {
  const size = adPlacementSizes[placement];

  if (!adsEnabled) {
    if (process.env.NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS === "true") {
      return (
        <div className={className}>
          <AdPlaceholder width={size.width} height={size.height} />
        </div>
      );
    }
    return null;
  }

  return (
    <div
      data-ad-placement={placement}
      style={{ minHeight: size.height, maxWidth: size.width }}
      className={cn("mx-auto w-full", className)}
    >
      {/* Real ad provider markup is rendered here once configured and approved. */}
    </div>
  );
}
