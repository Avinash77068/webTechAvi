"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ErrorBanner } from "@/components/tools/error-banner";
import { ProcessingProgress } from "@/components/tools/processing-progress";
import { ResultActions } from "@/components/tools/result-actions";
import { formatBytes, sniffImageType, stripExtension } from "@/lib/validation";
import { downloadBlob } from "@/lib/download";
import {
  calculateResize,
  canvasToBlob,
  loadImageBitmap,
  formatToExtension,
  type OutputImageFormat,
} from "@/lib/image/canvas-utils";
import { getToolBySlug } from "@/lib/tools-registry";
import { PERCENT_PRESETS } from "../constants";

const tool = getToolBySlug("image-resizer")!;

export function ImageResizerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputImageFormat>("jpeg");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

  async function handleFilesAccepted(files: File[]) {
    const picked = files[0];
    if (!picked) return;
    setErrors([]);
    setResultBlob(null);
    setResultUrl(null);

    try {
      const bitmap = await loadImageBitmap(picked);
      const sniffed = await sniffImageType(picked);
      setOutputFormat(sniffed === "png" ? "png" : sniffed === "webp" ? "webp" : "jpeg");
      setFile(picked);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(picked);
      });
      setNaturalSize({ width: bitmap.width, height: bitmap.height });
      setWidth(String(bitmap.width));
      setHeight(String(bitmap.height));
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Couldn't load this image."]);
    }
  }

  function applyPercent(percent: number) {
    if (!naturalSize) return;
    setWidth(String(Math.round((naturalSize.width * percent) / 100)));
    setHeight(String(Math.round((naturalSize.height * percent) / 100)));
  }

  function handleWidthChange(value: string) {
    setWidth(value);
    if (maintainAspectRatio && naturalSize && value) {
      const w = Number(value);
      if (w > 0) setHeight(String(Math.round((w / naturalSize.width) * naturalSize.height)));
    }
  }

  function handleHeightChange(value: string) {
    setHeight(value);
    if (maintainAspectRatio && naturalSize && value) {
      const h = Number(value);
      if (h > 0) setWidth(String(Math.round((h / naturalSize.height) * naturalSize.width)));
    }
  }

  async function handleResize() {
    if (!file || !naturalSize) return;
    const targetWidth = Number(width);
    const targetHeight = Number(height);
    if (!targetWidth || !targetHeight || targetWidth < 1 || targetHeight < 1) {
      setErrors(["Enter a valid width and height (at least 1px each)."]);
      return;
    }

    setErrors([]);
    setIsProcessing(true);
    try {
      const bitmap = await loadImageBitmap(file);
      const dims = calculateResize(naturalSize, { width: targetWidth, height: targetHeight }, false);
      const resizedCanvas = document.createElement("canvas");
      resizedCanvas.width = dims.width;
      resizedCanvas.height = dims.height;
      const ctx = resizedCanvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is not supported in this browser.");
      ctx.drawImage(bitmap, 0, 0, dims.width, dims.height);

      const blob = await canvasToBlob(resizedCanvas, outputFormat, 0.92);
      setResultBlob(blob);
      setResultUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Failed to resize this image."]);
    } finally {
      setIsProcessing(false);
    }
  }

  function reset() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setPreviewUrl(null);
    setNaturalSize(null);
    setWidth("");
    setHeight("");
    setResultBlob(null);
    setResultUrl(null);
    setErrors([]);
  }

  if (!file) {
    return (
      <div className="space-y-4">
        <FileDropzone
          accept="image/jpeg,image/png,image/webp"
          acceptedMimeTypes={["image/jpeg", "image/png", "image/webp"]}
          acceptedFormatsLabel={tool.acceptedFormats.join(", ")}
          maxSizeMB={tool.maxFileSizeMB}
          onFilesAccepted={handleFilesAccepted}
          onFilesRejected={setErrors}
        />
        <ErrorBanner messages={errors} title="Couldn't add that file" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-[180px_1fr]">
        {previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="" className="h-40 w-full rounded-lg border border-border object-contain bg-muted/30" />
        )}
        <div className="space-y-3">
          <p className="text-sm font-medium">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            Original: {naturalSize?.width}×{naturalSize?.height}px · {formatBytes(file.size)}
          </p>

          <div className="flex items-center gap-2">
            <Switch id="aspect-ratio" checked={maintainAspectRatio} onCheckedChange={setMaintainAspectRatio} />
            <Label htmlFor="aspect-ratio">Maintain aspect ratio</Label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="width-input">Width (px)</Label>
              <Input
                id="width-input"
                type="number"
                min={1}
                value={width}
                onChange={(e) => handleWidthChange(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="height-input">Height (px)</Label>
              <Input
                id="height-input"
                type="number"
                min={1}
                value={height}
                onChange={(e) => handleHeightChange(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {PERCENT_PRESETS.map((percent) => (
              <Button key={percent} type="button" variant="outline" size="sm" onClick={() => applyPercent(percent)}>
                {percent}%
              </Button>
            ))}
          </div>
        </div>
      </div>

      <ErrorBanner messages={errors} />

      {isProcessing && <ProcessingProgress label="Resizing image…" />}

      {resultBlob && resultUrl && (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm font-medium">Resized preview</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={resultUrl} alt="" className="mt-2 max-h-72 rounded-lg border border-border object-contain" />
          <p className="mt-2 text-xs text-muted-foreground">
            New size: {formatBytes(resultBlob.size)}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {!resultBlob ? (
          <>
            <Button type="button" onClick={handleResize} disabled={isProcessing}>
              {isProcessing ? "Resizing…" : "Resize image"}
            </Button>
            <Button type="button" variant="outline" onClick={reset}>
              Choose a different image
            </Button>
          </>
        ) : (
          <ResultActions
            onDownload={() =>
              downloadBlob(
                resultBlob,
                `${stripExtension(file.name)}-resized.${formatToExtension[outputFormat]}`
              )
            }
            onReset={reset}
          />
        )}
      </div>
    </div>
  );
}
