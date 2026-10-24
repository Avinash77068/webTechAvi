"use client";

import { useState } from "react";
import { useFfmpegJob } from "@/hooks/use-ffmpeg-job";
import { useObjectUrl } from "@/hooks/use-object-url";
import { stripExtension } from "@/lib/validation";
import { MIN_CLIP_SECONDS, PRECISE_CODEC_ARGS } from "../constants";

export function useVideoTrimmer() {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [range, setRange] = useState<[number, number]>([0, 0]);
  const [precise, setPrecise] = useState(false);
  const previewUrl = useObjectUrl(file);
  const job = useFfmpegJob();

  const extension = file?.name.toLowerCase().endsWith(".webm") ? "webm" : "mp4";

  function selectFile(picked: File) {
    job.reset();
    setDuration(0);
    setRange([0, 0]);
    setFile(picked);
  }

  function handleMetadataLoaded(videoDuration: number) {
    if (!Number.isFinite(videoDuration)) return;
    setDuration(videoDuration);
    setRange([0, videoDuration]);
  }

  function setStart(value: number) {
    setRange(([, end]) => [Math.min(Math.max(0, value), end - MIN_CLIP_SECONDS), end]);
  }

  function setEnd(value: number) {
    setRange(([start]) => [start, Math.max(Math.min(duration, value), start + MIN_CLIP_SECONDS)]);
  }

  async function trim() {
    if (!file) return;
    const [start, end] = range;
    await job.run({
      file,
      outputExtension: extension,
      outputMimeType: `video/${extension}`,
      buildArgs: (input, output) => [
        "-ss", start.toFixed(2),
        "-i", input,
        "-t", (end - start).toFixed(2),
        ...(precise ? PRECISE_CODEC_ARGS[extension] : ["-c", "copy", "-avoid_negative_ts", "make_zero"]),
        output,
      ],
    });
  }

  function reset() {
    job.reset();
    setFile(null);
    setDuration(0);
    setRange([0, 0]);
  }

  return {
    file,
    previewUrl,
    duration,
    range,
    precise,
    setPrecise,
    setStart,
    setEnd,
    selectFile,
    handleMetadataLoaded,
    trim,
    reset,
    outputName: file ? `${stripExtension(file.name)}-trimmed.${extension}` : `trimmed.${extension}`,
    job,
  };
}
