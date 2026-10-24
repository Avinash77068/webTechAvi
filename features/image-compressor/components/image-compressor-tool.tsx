"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ErrorBanner } from "@/components/tools/error-banner";
import { formatBytes, sniffImageType, stripExtension } from "@/lib/validation";
import { downloadBlob } from "@/lib/download";
import {
  canvasToBlob,
  drawBitmapToCanvas,
  loadImageBitmap,
  formatToExtension,
  type OutputImageFormat,
} from "@/lib/image/canvas-utils";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("image-compressor")!;

type FormatOption = "keep" | OutputImageFormat;

interface CompressItem {
  id: string;
  file: File;
  previewUrl: string;
  status: "pending" | "processing" | "done" | "error";
  resultBlob?: Blob;
  resultUrl?: string;
  error?: string;
}

function detectedFormat(file: File): Promise<OutputImageFormat> {
  return sniffImageType(file).then((sniffed) => {
    if (sniffed === "png") return "png";
    if (sniffed === "webp") return "webp";
    return "jpeg";
  });
}

export function ImageCompressorTool() {
  const [items, setItems] = useState<CompressItem[]>([]);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<FormatOption>("keep");
  const [rejectedErrors, setRejectedErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const itemsRef = useRef<CompressItem[]>([]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    return () => {
      for (const item of itemsRef.current) {
        URL.revokeObjectURL(item.previewUrl);
        if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
      }
    };
  }, []);

  function handleFilesAccepted(files: File[]) {
    setRejectedErrors([]);
    const newItems: CompressItem[] = files.map((file) => ({
      id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
      file,
      previewUrl: URL.createObjectURL(file),
      status: "pending",
    }));
    setItems((prev) => [...prev, ...newItems]);
  }

  async function compressAll() {
    setIsProcessing(true);
    for (const item of itemsRef.current) {
      if (item.status === "done") continue;
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: "processing", error: undefined } : i))
      );
      try {
        const bitmap = await loadImageBitmap(item.file);
        const canvas = drawBitmapToCanvas(bitmap, bitmap.width, bitmap.height);
        const outputFormat = format === "keep" ? await detectedFormat(item.file) : format;
        const blob = await canvasToBlob(canvas, outputFormat, quality / 100);
        const resultUrl = URL.createObjectURL(blob);
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, status: "done", resultBlob: blob, resultUrl } : i
          )
        );
      } catch (error) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: "error", error: error instanceof Error ? error.message : "Failed to compress this image." }
              : i
          )
        );
      }
    }
    setIsProcessing(false);
  }

  function downloadItem(item: CompressItem) {
    if (!item.resultBlob) return;
    const outFormat = format === "keep" ? item.resultBlob.type.split("/")[1] : format;
    const ext = formatToExtension[(outFormat as OutputImageFormat) ?? "jpeg"] ?? "jpg";
    downloadBlob(item.resultBlob, `${stripExtension(item.file.name)}-compressed.${ext}`);
  }

  function reset() {
    for (const item of items) {
      URL.revokeObjectURL(item.previewUrl);
      if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
    }
    setItems([]);
    setRejectedErrors([]);
  }

  const hasPending = items.some((i) => i.status !== "done");

  return (
    <div className="space-y-5">
      <FileDropzone
        accept="image/jpeg,image/png,image/webp"
        acceptedMimeTypes={["image/jpeg", "image/png", "image/webp"]}
        acceptedFormatsLabel={tool.acceptedFormats.join(", ")}
        maxSizeMB={tool.maxFileSizeMB}
        multiple
        onFilesAccepted={handleFilesAccepted}
        onFilesRejected={setRejectedErrors}
      />

      <ErrorBanner messages={rejectedErrors} title="Some files couldn't be added" />

      {items.length > 0 && (
        <>
          <div className="grid gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-2">
            <div>
              <Label id="quality-slider-label">Quality: {quality}%</Label>
              <Slider
                aria-labelledby="quality-slider-label"
                className="mt-2"
                min={10}
                max={100}
                step={5}
                value={[quality]}
                onValueChange={(value) => setQuality(Array.isArray(value) ? value[0] : value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Lower quality means a smaller file but more visible compression artifacts.
              </p>
            </div>
            <div>
              <Label htmlFor="format-select">Output format</Label>
              <Select value={format} onValueChange={(value) => setFormat(value as FormatOption)}>
                <SelectTrigger id="format-select" className="mt-2 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="keep">Keep original format</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                </SelectContent>
              </Select>
              {(format === "png" || format === "keep") && (
                <p className="mt-1 text-xs text-muted-foreground">
                  PNG is lossless — the quality slider doesn't shrink it. Choose JPEG or WebP
                  for a smaller file.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" onClick={compressAll} disabled={isProcessing || !hasPending}>
              {isProcessing ? "Compressing…" : "Compress images"}
            </Button>
            <Button type="button" variant="outline" onClick={reset}>
              Clear all
            </Button>
          </div>

          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.previewUrl}
                  alt=""
                  className="size-16 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(item.file.size)}
                    {item.status === "done" && item.resultBlob && (
                      <>
                        {" "}
                        → {formatBytes(item.resultBlob.size)}{" "}
                        <span
                          className={
                            item.resultBlob.size < item.file.size ? "text-primary" : "text-muted-foreground"
                          }
                        >
                          (
                          {item.resultBlob.size < item.file.size ? "−" : "+"}
                          {Math.abs(Math.round((1 - item.resultBlob.size / item.file.size) * 100))}%)
                        </span>
                      </>
                    )}
                  </p>
                  {item.status === "processing" && (
                    <p className="text-xs text-primary">Compressing…</p>
                  )}
                  {item.status === "error" && <p className="text-xs text-destructive">{item.error}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {item.status === "done" ? (
                    <Button type="button" size="sm" onClick={() => downloadItem(item)}>
                      Download
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setItems((prev) => prev.filter((i) => i.id !== item.id))
                      }
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {items.length === 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          <Plus className="size-4" aria-hidden="true" />
          Add one or more images to get started.
        </div>
      )}
    </div>
  );
}
