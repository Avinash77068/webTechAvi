"use client";

import { FileVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ErrorBanner } from "@/components/tools/error-banner";
import { ProcessingProgress } from "@/components/tools/processing-progress";
import { ResultActions } from "@/components/tools/result-actions";
import { formatBytes } from "@/lib/validation";
import { downloadBlob } from "@/lib/download";
import { VIDEO_ACCEPT, VIDEO_EXTENSIONS, VIDEO_MIME_TYPES } from "@/lib/ffmpeg/video-input";
import { getToolBySlug } from "@/lib/tools-registry";
import { useAudioExtractor } from "../hooks/use-audio-extractor";
import {
  AUDIO_FORMATS,
  type AudioFormat,
} from "../constants";

const tool = getToolBySlug("audio-extractor")!;

export function AudioExtractorTool() {
  const extractor = useAudioExtractor();
  const { job, file } = extractor;

  if (job.result) {
    return (
      <div className="space-y-5">
        <audio src={extractor.audioUrl ?? undefined} controls className="w-full" />
        <p className="text-sm text-muted-foreground">
          {AUDIO_FORMATS[extractor.format].label} · {formatBytes(job.result.blob.size)}
        </p>
        <ResultActions
          downloadLabel="Download audio"
          onDownload={() => downloadBlob(job.result!.blob, extractor.outputName)}
          onReset={extractor.reset}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <FileDropzone
        accept={VIDEO_ACCEPT}
        acceptedMimeTypes={VIDEO_MIME_TYPES}
        acceptedExtensions={VIDEO_EXTENSIONS}
        acceptedFormatsLabel="MP4 or WebM"
        maxSizeMB={tool.maxFileSizeMB}
        disabled={job.isProcessing}
        onFilesAccepted={(files) => files[0] && extractor.selectFile(files[0])}
        onFilesRejected={job.setErrors}
      />

      <ErrorBanner messages={job.errors} />

      {file && (
        <>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
            <FileVideo className="size-8 shrink-0 text-primary" aria-hidden="true" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-border bg-background p-4">
            <Label>Audio format</Label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(AUDIO_FORMATS).map(([value, f]) => (
                <Button
                  key={value}
                  type="button"
                  size="sm"
                  variant={value === extractor.format ? "default" : "outline"}
                  onClick={() => extractor.setFormat(value as AudioFormat)}
                >
                  {f.label}
                </Button>
              ))}
            </div>
          </div>

          {job.isProcessing && <ProcessingProgress label="Extracting audio…" progress={job.progress} />}

          <Button type="button" onClick={extractor.extract} disabled={job.isProcessing}>
            {job.isProcessing ? "Extracting…" : "Extract audio"}
          </Button>
        </>
      )}
    </div>
  );
}
