export type VideoFormat = "mp4" | "webm";

export const FORMATS: Record<VideoFormat, { label: string; mimeType: string; codecArgs: string[] }> = {
  mp4: {
    label: "MP4",
    mimeType: "video/mp4",
    codecArgs: ["-c:v", "libx264", "-preset", "veryfast", "-c:a", "aac", "-movflags", "+faststart"],
  },
  webm: {
    label: "WebM",
    mimeType: "video/webm",
    codecArgs: ["-c:v", "libvpx", "-b:v", "1M", "-c:a", "libvorbis"],
  },
};

/** Lower CRF means higher quality and a larger file. */
export const QUALITY_PRESETS = {
  high: { label: "High quality", crf: 23 },
  balanced: { label: "Balanced", crf: 28 },
  small: { label: "Smallest file", crf: 34 },
} as const;
export type QualityKey = keyof typeof QUALITY_PRESETS;

export const RESOLUTIONS = {
  original: { label: "Original", height: null },
  "720": { label: "720p", height: 720 },
  "480": { label: "480p", height: 480 },
  "360": { label: "360p", height: 360 },
} as const;
export type ResolutionKey = keyof typeof RESOLUTIONS;
