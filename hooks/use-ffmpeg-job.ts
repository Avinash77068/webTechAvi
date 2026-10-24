"use client";

import { useCallback, useState } from "react";
import { runFfmpegJob, type FfmpegJob } from "@/lib/ffmpeg/ffmpeg-client";

export interface FfmpegResult {
  blob: Blob;
  extension: string;
}

/** Tracks the processing state of a single ffmpeg run so tools only describe the command. */
export function useFfmpegJob() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [errors, setErrors] = useState<string[]>([]);
  const [result, setResult] = useState<FfmpegResult | null>(null);

  const run = useCallback(async (job: Omit<FfmpegJob, "onProgress">) => {
    setErrors([]);
    setResult(null);
    setProgress(undefined);
    setIsProcessing(true);
    try {
      const blob = await runFfmpegJob({ ...job, onProgress: setProgress });
      setResult({ blob, extension: job.outputExtension });
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Processing failed. Please try again."]);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setErrors([]);
    setProgress(undefined);
  }, []);

  return { isProcessing, progress, errors, setErrors, result, run, reset };
}
