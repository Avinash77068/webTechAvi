/** Re-encode settings used for frame-accurate trimming, keyed by the output container. */
export const PRECISE_CODEC_ARGS: Record<"mp4" | "webm", string[]> = {
  mp4: ["-c:v", "libx264", "-preset", "veryfast", "-c:a", "aac"],
  webm: ["-c:v", "libvpx", "-b:v", "1M", "-c:a", "libvorbis"],
};

export const MIN_CLIP_SECONDS = 0.1;
