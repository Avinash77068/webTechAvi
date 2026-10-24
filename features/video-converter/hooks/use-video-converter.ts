"use client";

import { useState } from "react";
import { useFfmpegJob } from "@/hooks/use-ffmpeg-job";
import { stripExtension } from "@/lib/validation";
import {
  FORMATS,
  QUALITY_PRESETS,
  RESOLUTIONS,
  type QualityKey,
  type ResolutionKey,
  type VideoFormat,
} from "../constants";

export function useVideoConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<VideoFormat>("mp4");
  const [quality, setQuality] = useState<QualityKey>("balanced");
  const [resolution, setResolution] = useState<ResolutionKey>("original");
  const job = useFfmpegJob();

  function selectFile(picked: File) {
    job.reset();
    setFile(picked);
  }

  async function convert() {
    if (!file) return;
    const { crf } = QUALITY_PRESETS[quality];
    const { height } = RESOLUTIONS[resolution];
    const { mimeType, codecArgs } = FORMATS[format];
    await job.run({
      file,
      outputExtension: format,
      outputMimeType: mimeType,
      buildArgs: (input, output) => [
        "-i", input,
        ...(height ? ["-vf", `scale=-2:${height}`] : []),
        ...codecArgs,
        "-crf", String(crf),
        output,
      ],
    });
  }

  function reset() {
    job.reset();
    setFile(null);
  }

  return {
    file,
    format,
    setFormat,
    quality,
    setQuality,
    resolution,
    setResolution,
    selectFile,
    convert,
    reset,
    outputName: file ? `${stripExtension(file.name)}-converted.${format}` : `converted.${format}`,
    job,
  };
}
