"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, FileText, Plus, RotateCcw, RotateCw, X } from "lucide-react";
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
import { ProcessingProgress } from "@/components/tools/processing-progress";
import { ResultActions } from "@/components/tools/result-actions";
import { formatBytes } from "@/lib/validation";
import { downloadBlob } from "@/lib/download";
import { buildPdfFromImages, normalizeImageForPdf, type PdfOrientation, type PdfPageSize } from "@/lib/pdf/image-to-pdf";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("image-to-pdf")!;

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  /** Clockwise, always 0, 90, 180 or 270. */
  rotation: number;
}

export function ImageToPdfTool() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<PdfPageSize>("a4");
  const [orientation, setOrientation] = useState<PdfOrientation>("portrait");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const itemsRef = useRef<ImageItem[]>([]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    return () => {
      for (const item of itemsRef.current) URL.revokeObjectURL(item.previewUrl);
    };
  }, []);

  function handleFilesAccepted(files: File[]) {
    setErrors([]);
    const newItems: ImageItem[] = files.map((file) => ({
      id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
      file,
      previewUrl: URL.createObjectURL(file),
      rotation: 0,
    }));
    setItems((prev) => [...prev, ...newItems]);
  }

  function move(index: number, direction: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function moveTo(index: number, target: number) {
    setItems((prev) => {
      if (target === index || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return next;
    });
  }

  /** Rotates one image, or every image when `id` is omitted. */
  function rotate(direction: 1 | -1, id?: string) {
    setItems((prev) =>
      prev.map((i) =>
        !id || i.id === id ? { ...i, rotation: (i.rotation + direction * 90 + 360) % 360 } : i
      )
    );
  }

  function removeItem(id: string) {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  }

  async function generatePdf() {
    if (items.length === 0) {
      setErrors(["Add at least one image first."]);
      return;
    }
    setErrors([]);
    setIsProcessing(true);
    try {
      const normalized = [];
      for (const item of items) {
        normalized.push(await normalizeImageForPdf(item.file, item.rotation));
      }
      const pdfBytes = await buildPdfFromImages(normalized, { pageSize, orientation });
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      setResultBlob(blob);
      setResultUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Failed to generate the PDF."]);
    } finally {
      setIsProcessing(false);
    }
  }

  function reset() {
    for (const item of items) URL.revokeObjectURL(item.previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setItems([]);
    setResultBlob(null);
    setResultUrl(null);
    setErrors([]);
  }

  if (resultBlob) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="size-6" aria-hidden="true" />
          </span>
          <div>
            <p className="font-medium">Your PDF is ready</p>
            <p className="text-sm text-muted-foreground">
              {items.length} page{items.length === 1 ? "" : "s"} · {formatBytes(resultBlob.size)}
            </p>
          </div>
        </div>
        <ResultActions
          downloadLabel="Download PDF"
          onDownload={() => downloadBlob(resultBlob, "images.pdf")}
          onReset={reset}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <FileDropzone
        accept="image/jpeg,image/png,image/webp"
        acceptedMimeTypes={["image/jpeg", "image/png", "image/webp"]}
        acceptedFormatsLabel={tool.acceptedFormats.join(", ")}
        maxSizeMB={tool.maxFileSizeMB}
        multiple
        onFilesAccepted={handleFilesAccepted}
        onFilesRejected={setErrors}
      />

      <ErrorBanner messages={errors} />

      {items.length > 0 && (
        <>
          <div className="grid gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="page-size">Page size</Label>
              <Select value={pageSize} onValueChange={(value) => setPageSize(value as PdfPageSize)}>
                <SelectTrigger id="page-size" className="mt-2 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4</SelectItem>
                  <SelectItem value="letter">Letter</SelectItem>
                  <SelectItem value="fit">Fit to image</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="orientation">Orientation</Label>
              <Select
                value={orientation}
                onValueChange={(value) => setOrientation(value as PdfOrientation)}
              >
                <SelectTrigger id="orientation" className="mt-2 w-full" disabled={pageSize === "fit"}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              {items.length > 1
                ? "Tip: click a page number to move that image to another position, and use the rotate buttons to turn any photo."
                : "Use the rotate buttons to turn the photo before creating the PDF."}
            </p>
            {items.length > 1 && (
              <div className="flex items-center gap-1">
                <span className="mr-1 text-xs font-medium">Rotate all</span>
                <Button type="button" size="icon-sm" variant="outline" aria-label="Rotate all left" onClick={() => rotate(-1)}>
                  <RotateCcw className="size-3.5" aria-hidden="true" />
                </Button>
                <Button type="button" size="icon-sm" variant="outline" aria-label="Rotate all right" onClick={() => rotate(1)}>
                  <RotateCw className="size-3.5" aria-hidden="true" />
                </Button>
              </div>
            )}
          </div>

          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={item.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                <Select
                  value={String(index + 1)}
                  onValueChange={(value) => moveTo(index, Number(value) - 1)}
                >
                  <SelectTrigger
                    aria-label={`Page ${index + 1}: change position of ${item.file.name}`}
                    title="Click to move this image to another page number"
                    className="h-8 min-w-14 shrink-0 justify-center gap-1 rounded-full border-primary/40 bg-primary/10 px-2 font-semibold text-primary"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {items.map((_, position) => (
                      <SelectItem key={position} value={String(position + 1)}>
                        {position + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.previewUrl}
                  alt=""
                  className="size-14 shrink-0 rounded-lg object-cover transition-transform duration-200"
                  style={item.rotation ? { transform: `rotate(${item.rotation}deg)` } : undefined}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(item.file.size)}
                    {item.rotation !== 0 && <span className="text-primary"> · Rotated {item.rotation}°</span>}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="outline"
                    aria-label="Rotate left"
                    onClick={() => rotate(-1, item.id)}
                  >
                    <RotateCcw className="size-3.5" aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="outline"
                    aria-label="Rotate right"
                    onClick={() => rotate(1, item.id)}
                  >
                    <RotateCw className="size-3.5" aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="outline"
                    aria-label="Move up"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                  >
                    <ArrowUp className="size-3.5" aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="outline"
                    aria-label="Move down"
                    disabled={index === items.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <ArrowDown className="size-3.5" aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="outline"
                    aria-label="Remove"
                    onClick={() => removeItem(item.id)}
                  >
                    <X className="size-3.5" aria-hidden="true" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          {isProcessing && <ProcessingProgress label="Generating PDF…" />}

          <Button type="button" onClick={generatePdf} disabled={isProcessing}>
            {isProcessing ? "Generating…" : `Generate PDF (${items.length} page${items.length === 1 ? "" : "s"})`}
          </Button>
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
