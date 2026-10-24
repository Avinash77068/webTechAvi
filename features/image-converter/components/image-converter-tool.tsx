"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ErrorBanner } from "@/components/tools/error-banner";
import { formatBytes, stripExtension } from "@/lib/validation";
import { downloadBlob } from "@/lib/download";
import {
  canvasToBlob,
  drawBitmapToCanvas,
  loadImageBitmap,
  formatToExtension,
  type OutputImageFormat,
} from "@/lib/image/canvas-utils";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("image-converter")!;

interface ConvertItem {
  id: string;
  file: File;
  previewUrl: string;
  status: "pending" | "processing" | "done" | "error";
  resultBlob?: Blob;
  resultUrl?: string;
  error?: string;
}

export function ImageConverterTool() {
  const [items, setItems] = useState<ConvertItem[]>([]);
  const [targetFormat, setTargetFormat] = useState<OutputImageFormat>("png");
  const [rejectedErrors, setRejectedErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const itemsRef = useRef<ConvertItem[]>([]);

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
    const newItems: ConvertItem[] = files.map((file) => ({
      id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
      file,
      previewUrl: URL.createObjectURL(file),
      status: "pending",
    }));
    setItems((prev) => [...prev, ...newItems]);
  }

  async function convertAll() {
    setIsProcessing(true);
    for (const item of itemsRef.current) {
      if (item.status === "done") continue;
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: "processing", error: undefined } : i))
      );
      try {
        const bitmap = await loadImageBitmap(item.file);
        const canvas = drawBitmapToCanvas(bitmap, bitmap.width, bitmap.height);
        const blob = await canvasToBlob(canvas, targetFormat, 0.92);
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
              ? {
                  ...i,
                  status: "error",
                  error:
                    error instanceof Error
                      ? error.message
                      : "This file couldn't be converted — it may be corrupted or an unsupported variant (such as some HEIC files).",
                }
              : i
          )
        );
      }
    }
    setIsProcessing(false);
  }

  function downloadItem(item: ConvertItem) {
    if (!item.resultBlob) return;
    downloadBlob(item.resultBlob, `${stripExtension(item.file.name)}.${formatToExtension[targetFormat]}`);
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
          <div className="rounded-xl border border-border bg-card p-4 sm:max-w-xs">
            <Label htmlFor="target-format">Convert to</Label>
            <Select value={targetFormat} onValueChange={(value) => setTargetFormat(value as OutputImageFormat)}>
              <SelectTrigger id="target-format" className="mt-2 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jpeg">JPEG</SelectItem>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="webp">WebP</SelectItem>
              </SelectContent>
            </Select>
            {targetFormat === "jpeg" && (
              <p className="mt-2 text-xs text-muted-foreground">
                JPEG doesn't support transparency — transparent areas become white.
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" onClick={convertAll} disabled={isProcessing || !hasPending}>
              {isProcessing ? "Converting…" : "Convert images"}
            </Button>
            <Button type="button" variant="outline" onClick={reset}>
              Clear all
            </Button>
          </div>

          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.previewUrl} alt="" className="size-16 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(item.file.size)}
                    {item.status === "done" && item.resultBlob && (
                      <> → {formatBytes(item.resultBlob.size)} ({targetFormat.toUpperCase()})</>
                    )}
                  </p>
                  {item.status === "processing" && <p className="text-xs text-primary">Converting…</p>}
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
                      onClick={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
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
