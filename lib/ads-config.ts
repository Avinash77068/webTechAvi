export const adsEnabled = process.env.NODE_ENV === "production";
export const adsensePublisherId = "ca-pub-8212836769232178";

export type AdPlacement = "homepage-leaderboard" | "tool-sidebar" | "between-content";

export const adPlacementConfig: Record<
  AdPlacement,
  {
    width: number;
    height: number;
    slotId: string;
    format: "auto" | "fluid";
    layoutKey?: string;
    fullWidthResponsive?: boolean;
  }
> = {
  "homepage-leaderboard": {
    width: 728,
    height: 90,
    slotId: "5283691158",
    format: "auto",
    fullWidthResponsive: true,
  },
  "tool-sidebar": {
    width: 300,
    height: 250,
    slotId: "5283691158",
    format: "auto",
    fullWidthResponsive: true,
  },
  "between-content": {
    width: 336,
    height: 280,
    slotId: "5866230807",
    format: "fluid",
    layoutKey: "-gw-3+1f-3d+2z",
  },
};
