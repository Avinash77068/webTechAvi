export const ASPECT_PRESETS: { label: string; value: number | undefined }[] = [
  { label: "Free", value: undefined },
  { label: "1:1", value: 1 },
  { label: "Passport 7:9", value: 7 / 9 },
  { label: "3:4", value: 3 / 4 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
];

/** Longest side of the on-screen preview; export always uses the full-size image. */
export const PREVIEW_MAX_SIDE = 1600;
