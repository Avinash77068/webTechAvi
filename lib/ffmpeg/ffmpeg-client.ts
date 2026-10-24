import type { FFmpeg } from "@ffmpeg/ffmpeg";

/**
 * The ffmpeg wrapper is served untouched from /public/ffmpeg (copied from
 * @ffmpeg/ffmpeg/dist/esm) and imported at runtime. Bundling it breaks because it
 * creates its worker from a dynamic URL that Turbopack and webpack cannot resolve.
 */
const FFMPEG_MODULE_URL = "/ffmpeg/index.js";

const CORE_VERSION = "0.12.10";
const CORE_BASE_URL = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/esm`;

let instance: Promise<FFmpeg> | null = null;

async function toBlobURL(url: string, mimeType: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Couldn't download the video engine. Check your connection and try again.");
  return URL.createObjectURL(new Blob([await response.arrayBuffer()], { type: mimeType }));
}

/** Loads ffmpeg.wasm once and reuses it, so the ~30 MB core is only downloaded on first use. */
function getFfmpeg(): Promise<FFmpeg> {
  if (!instance) {
    instance = (async () => {
      const { FFmpeg } = (await import(
        /* webpackIgnore: true */ /* turbopackIgnore: true */ FFMPEG_MODULE_URL
      )) as typeof import("@ffmpeg/ffmpeg");
      const ffmpeg = new FFmpeg();
      await ffmpeg.load({
        coreURL: await toBlobURL(`${CORE_BASE_URL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${CORE_BASE_URL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      return ffmpeg;
    })();
    instance.catch(() => {
      instance = null;
    });
  }
  return instance;
}

export interface FfmpegJob {
  file: File;
  /** Output file extension without the dot, e.g. "mp4". */
  outputExtension: string;
  outputMimeType: string;
  /** Builds the ffmpeg arguments for the given virtual input and output file names. */
  buildArgs: (input: string, output: string) => string[];
  /** Called with a 0-100 value while ffmpeg is encoding. */
  onProgress?: (percent: number) => void;
}

export async function runFfmpegJob({
  file,
  outputExtension,
  outputMimeType,
  buildArgs,
  onProgress,
}: FfmpegJob): Promise<Blob> {
  const ffmpeg = await getFfmpeg();
  const inputExtension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "mp4";
  const input = `input.${inputExtension}`;
  const output = `output.${outputExtension}`;

  const handleProgress = ({ progress }: { progress: number }) => {
    onProgress?.(Math.min(100, Math.max(0, progress * 100)));
  };
  ffmpeg.on("progress", handleProgress);

  try {
    await ffmpeg.writeFile(input, new Uint8Array(await file.arrayBuffer()));
    const exitCode = await ffmpeg.exec(buildArgs(input, output));
    if (exitCode !== 0) {
      throw new Error("This file couldn't be processed. It may use a codec the browser version of ffmpeg doesn't support.");
    }
    const data = await ffmpeg.readFile(output);
    if (typeof data === "string") throw new Error("Unexpected output from ffmpeg.");
    return new Blob([data as BlobPart], { type: outputMimeType });
  } finally {
    ffmpeg.off("progress", handleProgress);
    await ffmpeg.deleteFile(input).catch(() => undefined);
    await ffmpeg.deleteFile(output).catch(() => undefined);
  }
}
