/**
 * Advertising is switched off until a real ad provider is configured and approved.
 * Flip this (and wire up the provider's script/config) when that happens — never
 * render placeholder or simulated ads to real visitors before then.
 */
export const adsEnabled = false;

export type AdPlacement = "homepage-leaderboard" | "tool-sidebar" | "between-content";

export const adPlacementSizes: Record<AdPlacement, { width: number; height: number }> = {
  "homepage-leaderboard": { width: 728, height: 90 },
  "tool-sidebar": { width: 300, height: 250 },
  "between-content": { width: 336, height: 280 },
};
