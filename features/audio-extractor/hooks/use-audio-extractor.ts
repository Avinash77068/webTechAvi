"use client";

import { useState } from "react";
import { useFfmpegJob } from "@/hooks/use-ffmpeg-job";
import { useObjectUrl } from "@/hooks/use-object-url";
import { stripExtension } from "@/lib/validation";
import { AUDIO_FORMATS, type AudioFormat } from "../constants";

export function useAudioExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<AudioFormat>("mp3");
  const job = useFfmpegJob();
  const audioUrl = useObjectUrl(job.result?.blob ?? null);

  function selectFile(picked: File) {
    job.reset();
    setFile(picked);
  }

  async function extract() {
    if (!file) return;
    const { mimeType, codecArgs } = AUDIO_FORMATS[format];
    await job.run({
      file,
      outputExtension: format,
      outputMimeType: mimeType,
      buildArgs: (input, output) => ["-i", input, "-vn", ...codecArgs, output],
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
    audioUrl,
    selectFile,
    extract,
    reset,
    outputName: file ? `${stripExtension(file.name)}.${format}` : `audio.${format}`,
    job,
  };
}
