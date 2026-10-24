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
import { useVideoConverter } from "../hooks/use-video-converter";
import {
  FORMATS,
  QUALITY_PRESETS,
  RESOLUTIONS,
  type QualityKey,
  type ResolutionKey,
  type VideoFormat,
} from "../constants";

const tool = getToolBySlug("video-converter")!;

function OptionGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option.value}
            type="button"
            size="sm"
            variant={option.value === value ? "default" : "outline"}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function VideoConverterTool() {
  const converter = useVideoConverter();
  const { job, file } = converter;

  if (job.result && file) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileVideo className="size-6" aria-hidden="true" />
          </span>
          <div>
            <p className="font-medium">Your video is ready</p>
            <p className="text-sm text-muted-foreground">
              {formatBytes(file.size)} → {formatBytes(job.result.blob.size)} · {FORMATS[converter.format].label}
            </p>
          </div>
        </div>
        <ResultActions
          downloadLabel="Download video"
          onDownload={() => downloadBlob(job.result!.blob, converter.outputName)}
          onReset={converter.reset}
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
        onFilesAccepted={(files) => files[0] && converter.selectFile(files[0])}
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

          <div className="space-y-4 rounded-xl border border-border bg-background p-4">
            <OptionGroup<VideoFormat>
              label="Output format"
              value={converter.format}
              onChange={converter.setFormat}
              options={Object.entries(FORMATS).map(([value, f]) => ({ value: value as VideoFormat, label: f.label }))}
            />
            <OptionGroup<QualityKey>
              label="Quality"
              value={converter.quality}
              onChange={converter.setQuality}
              options={Object.entries(QUALITY_PRESETS).map(([value, p]) => ({ value: value as QualityKey, label: p.label }))}
            />
            <OptionGroup<ResolutionKey>
              label="Resolution"
              value={converter.resolution}
              onChange={converter.setResolution}
              options={Object.entries(RESOLUTIONS).map(([value, r]) => ({ value: value as ResolutionKey, label: r.label }))}
            />
          </div>

          {job.isProcessing && <ProcessingProgress label="Converting video…" progress={job.progress} />}

          <Button type="button" onClick={converter.convert} disabled={job.isProcessing}>
            {job.isProcessing ? "Converting…" : "Convert video"}
          </Button>
        </>
      )}
    </div>
  );
}
