export type AudioFormat = "mp3" | "m4a" | "wav";

export const AUDIO_FORMATS: Record<AudioFormat, { label: string; mimeType: string; codecArgs: string[] }> = {
  mp3: { label: "MP3", mimeType: "audio/mpeg", codecArgs: ["-c:a", "libmp3lame", "-b:a", "192k"] },
  m4a: { label: "M4A (AAC)", mimeType: "audio/mp4", codecArgs: ["-c:a", "aac", "-b:a", "192k"] },
  wav: { label: "WAV (lossless)", mimeType: "audio/wav", codecArgs: ["-c:a", "pcm_s16le"] },
};
