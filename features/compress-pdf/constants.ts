export const PRESETS = {
  smaller: { label: "Smaller file", scale: 1, quality: 0.45 },
  balanced: { label: "Balanced", scale: 1.5, quality: 0.6 },
  quality: { label: "Better quality", scale: 2, quality: 0.78 },
} as const;
export type PresetKey = keyof typeof PRESETS;
