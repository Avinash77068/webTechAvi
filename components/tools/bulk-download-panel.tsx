"use client";

import { useState } from "react";
import { CheckCircle2, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { downloadBlob } from "@/lib/download";
import {
  blobFormat,
  convertImageBlob,
  formatToExtension,
  type OutputImageFormat,
} from "@/lib/image/canvas-utils";

export type DownloadFormat = "keep" | OutputImageFormat;

export interface DownloadableImage {
  /** File name without extension, e.g. "holiday-rotated". */
  baseName: string;
  blob: Blob;
}

/** Converts to the chosen format (if needed) and saves a single image. */
export async function downloadImage(image: DownloadableImage, format: DownloadFormat) {
  const blob = format === "keep" ? image.blob : await convertImageBlob(image.blob, format);
  downloadBlob(blob, `${image.baseName}.${formatToExtension[blobFormat(blob)]}`);
}

export function DownloadFormatSelect({
  value,
  onChange,
  id = "download-format",
}: {
  value: DownloadFormat;
  onChange: (value: DownloadFormat) => void;
  id?: string;
}) {
  return (
    <div>
      <Label htmlFor={id}>Download as</Label>
      <Select value={value} onValueChange={(v) => onChange(v as DownloadFormat)}>
        <SelectTrigger id={id} className="mt-2 w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="keep">Original format</SelectItem>
          <SelectItem value="jpeg">JPEG</SelectItem>
          <SelectItem value="png">PNG</SelectItem>
          <SelectItem value="webp">WebP</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

/**
 * Final call to action for batch image tools: pick the download type and save every finished
 * image in one ZIP (or the single file when there is only one).
 */
export function BulkDownloadPanel({
  images,
  totalCount,
  format,
  onFormatChange,
  zipName,
  onReset,
}: {
  images: DownloadableImage[];
  totalCount: number;
  format: DownloadFormat;
  onFormatChange: (value: DownloadFormat) => void;
  zipName: string;
  onReset: () => void;
}) {
  const [isZipping, setIsZipping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (images.length === 0) return null;

  async function downloadAll() {
    setIsZipping(true);
    setError(null);
    try {
      if (images.length === 1) {
        await downloadImage(images[0], format);
        return;
      }
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      const used = new Set<string>();
      for (const image of images) {
        const blob = format === "keep" ? image.blob : await convertImageBlob(image.blob, format);
        const ext = formatToExtension[blobFormat(blob)];
        let name = `${image.baseName}.${ext}`;
        for (let n = 2; used.has(name); n++) name = `${image.baseName}-${n}.${ext}`;
        used.add(name);
        zip.file(name, blob);
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, zipName);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't prepare the download.");
    } finally {
      setIsZipping(false);
    }
  }

  const allDone = images.length === totalCount;

  return (
    <section
      aria-label="Download results"
      className="flex flex-wrap items-end gap-4 rounded-xl border border-primary/40 bg-primary/5 p-4"
    >
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 font-semibold">
          <CheckCircle2 className="size-5 text-primary" aria-hidden="true" />
          {allDone
            ? `All ${totalCount} image${totalCount === 1 ? "" : "s"} ready`
            : `${images.length} of ${totalCount} images ready`}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {images.length > 1
            ? "Download everything together as one ZIP file."
            : "Your image is ready to download."}
        </p>
        {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
      </div>
      <DownloadFormatSelect value={format} onChange={onFormatChange} id={`${zipName}-format`} />
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="lg" onClick={downloadAll} disabled={isZipping}>
          <Download aria-hidden="true" />
          {isZipping
            ? "Preparing…"
            : images.length > 1
              ? `Download all (${images.length}) as ZIP`
              : "Download"}
        </Button>
        <Button type="button" size="lg" variant="outline" onClick={onReset} disabled={isZipping}>
          <RotateCcw aria-hidden="true" />
          Start over
        </Button>
      </div>
    </section>
  );
}
