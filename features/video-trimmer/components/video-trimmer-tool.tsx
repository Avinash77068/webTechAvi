"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ErrorBanner } from "@/components/tools/error-banner";
import { ProcessingProgress } from "@/components/tools/processing-progress";
import { ResultActions } from "@/components/tools/result-actions";
import { useObjectUrl } from "@/hooks/use-object-url";
import { formatBytes } from "@/lib/validation";
import { downloadBlob } from "@/lib/download";
import { VIDEO_ACCEPT, VIDEO_EXTENSIONS, VIDEO_MIME_TYPES } from "@/lib/ffmpeg/video-input";
import { getToolBySlug } from "@/lib/tools-registry";
import { useVideoTrimmer } from "../hooks/use-video-trimmer";
import { formatTimestamp } from "../utils";

const tool = getToolBySlug("video-trimmer")!;

export function VideoTrimmerTool() {
  const trimmer = useVideoTrimmer();
  const { job, file, range, duration } = trimmer;
  const resultUrl = useObjectUrl(job.result?.blob ?? null);

  if (job.result) {
    return (
      <div className="space-y-5">
        <video src={resultUrl ?? undefined} controls className="max-h-96 w-full rounded-xl bg-black" />
        <p className="text-sm text-muted-foreground">
          Trimmed clip · {formatTimestamp(range[1] - range[0])} · {formatBytes(job.result.blob.size)}
        </p>
        <ResultActions
          downloadLabel="Download trimmed video"
          onDownload={() => downloadBlob(job.result!.blob, trimmer.outputName)}
          onReset={trimmer.reset}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {!file ? (
        <FileDropzone
          accept={VIDEO_ACCEPT}
          acceptedMimeTypes={VIDEO_MIME_TYPES}
          acceptedExtensions={VIDEO_EXTENSIONS}
          acceptedFormatsLabel="MP4 or WebM"
          maxSizeMB={tool.maxFileSizeMB}
          onFilesAccepted={(files) => files[0] && trimmer.selectFile(files[0])}
          onFilesRejected={job.setErrors}
        />
      ) : (
        <>
          <video
            src={trimmer.previewUrl ?? undefined}
            controls
            onLoadedMetadata={(event) => trimmer.handleMetadataLoaded(event.currentTarget.duration)}
            className="max-h-96 w-full rounded-xl bg-black"
          />

          {duration > 0 && (
            <div className="space-y-4 rounded-xl border border-border bg-background p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="trim-start">Start · {formatTimestamp(range[0])}</Label>
                  <input
                    id="trim-start"
                    type="range"
                    min={0}
                    max={duration}
                    step={0.1}
                    value={range[0]}
                    onChange={(event) => trimmer.setStart(Number(event.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trim-end">End · {formatTimestamp(range[1])}</Label>
                  <input
                    id="trim-end"
                    type="range"
                    min={0}
                    max={duration}
                    step={0.1}
                    value={range[1]}
                    onChange={(event) => trimmer.setEnd(Number(event.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Clip length: {formatTimestamp(range[1] - range[0])} of {formatTimestamp(duration)}
              </p>
              <div className="flex items-center gap-3">
                <Switch id="precise" checked={trimmer.precise} onCheckedChange={trimmer.setPrecise} />
                <Label htmlFor="precise">Frame-accurate (slower, re-encodes the video)</Label>
              </div>
            </div>
          )}

          <ErrorBanner messages={job.errors} />
          {job.isProcessing && <ProcessingProgress label="Trimming video…" progress={job.progress} />}

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={trimmer.trim} disabled={job.isProcessing || duration === 0}>
              {job.isProcessing ? "Trimming…" : "Trim video"}
            </Button>
            <Button type="button" variant="outline" onClick={trimmer.reset} disabled={job.isProcessing}>
              Choose another file
            </Button>
          </div>
        </>
      )}
      {!file && <ErrorBanner messages={job.errors} />}
    </div>
  );
}
