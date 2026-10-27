"use client";

import { useEffect, useRef, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop, type PercentCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CheckCircle2, Download, RotateCcw, RotateCw, X } from "lucide-react";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ErrorBanner } from "@/components/tools/error-banner";
import {
  BulkDownloadPanel,
  downloadImage,
  type DownloadFormat,
} from "@/components/tools/bulk-download-panel";
import { sniffImageType, stripExtension } from "@/lib/validation";
import {
  canvasToBlob,
  drawBitmapToCanvas,
  loadImageBitmap,
  type OutputImageFormat,
} from "@/lib/image/canvas-utils";
import { getToolBySlug } from "@/lib/tools-registry";
import { ASPECT_PRESETS } from "../constants";

const tool = getToolBySlug("image-cropper")!;

interface CropItem {
  id: string;
  file: File;
  format: OutputImageFormat;
  originalUrl: string;
  /** Equals originalUrl until the image is rotated. */
  workingUrl: string;
  crop?: PercentCrop;
  resultBlob?: Blob;
  resultUrl?: string;
  error?: string;
}

function initialCrop(aspect: number | undefined, width: number, height: number): PercentCrop {
  const base = { unit: "%" as const, width: 80 };
  const crop = aspect ? makeAspectCrop(base, aspect, width, height) : { ...base, height: 80, x: 0, y: 0 };
  return centerCrop(crop, width, height);
}

/**
 * Maps a percentage crop onto an image of the given size. With an aspect ratio the box keeps
 * that ratio (images of a different shape would otherwise get a stretched box), stays centred on
 * the same spot and is clamped inside the image.
 */
function toPixelCrop(crop: PercentCrop, width: number, height: number, aspect: number | undefined) {
  let w = (crop.width / 100) * width;
  let h = (crop.height / 100) * height;
  const cx = ((crop.x + crop.width / 2) / 100) * width;
  const cy = ((crop.y + crop.height / 2) / 100) * height;
  if (aspect) {
    h = w / aspect;
    if (h > height) {
      h = height;
      w = h * aspect;
    }
    if (w > width) {
      w = width;
      h = w / aspect;
    }
  }
  w = Math.max(1, Math.round(w));
  h = Math.max(1, Math.round(h));
  const x = Math.min(Math.max(0, Math.round(cx - w / 2)), width - w);
  const y = Math.min(Math.max(0, Math.round(cy - h / 2)), height - h);
  return { x, y, width: w, height: h };
}

async function cropImage(item: CropItem, crop: PercentCrop, aspect: number | undefined): Promise<Blob> {
  const bitmap = await loadImageBitmap(await (await fetch(item.workingUrl)).blob());
  const area = toPixelCrop(crop, bitmap.width, bitmap.height, aspect);
  const canvas = document.createElement("canvas");
  canvas.width = area.width;
  canvas.height = area.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  if (item.format === "jpeg") {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(bitmap, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);
  bitmap.close();
  return canvasToBlob(canvas, item.format, 0.92);
}

function revokeItem(item: CropItem) {
  URL.revokeObjectURL(item.originalUrl);
  if (item.workingUrl !== item.originalUrl) URL.revokeObjectURL(item.workingUrl);
  if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
}

export function ImageCropperTool() {
  const [items, setItems] = useState<CropItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [applyToAll, setApplyToAll] = useState(true);
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>("keep");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const imgRef = useRef<HTMLImageElement>(null);
  const itemsRef = useRef<CropItem[]>([]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    return () => itemsRef.current.forEach(revokeItem);
  }, []);

  const active = items.find((i) => i.id === activeId) ?? items[0];
  const bulk = applyToAll && items.length > 1;
  const doneItems = items.filter((i) => i.resultBlob);

  function patchItem(id: string, patch: Partial<CropItem>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  async function handleFilesAccepted(files: File[]) {
    setErrors([]);
    const added: CropItem[] = [];
    const failed: string[] = [];
    for (const file of files) {
      try {
        const bitmap = await loadImageBitmap(file); // validates decodability up front
        bitmap.close();
        const sniffed = await sniffImageType(file);
        const url = URL.createObjectURL(file);
        added.push({
          id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
          file,
          format: sniffed === "jpeg" ? "jpeg" : sniffed === "webp" ? "webp" : "png",
          originalUrl: url,
          workingUrl: url,
        });
      } catch {
        failed.push(`${file.name}: this image could not be decoded.`);
      }
    }
    setErrors(failed);
    if (added.length === 0) return;
    setItems((prev) => [...prev, ...added]);
    setActiveId((prev) => prev ?? added[0].id);
  }

  function onImageLoad(event: React.SyntheticEvent<HTMLImageElement>) {
    if (!active || active.crop) return;
    const { naturalWidth, naturalHeight } = event.currentTarget;
    patchItem(active.id, { crop: initialCrop(aspect, naturalWidth, naturalHeight) });
  }

  function changeAspect(value: number | undefined) {
    setAspect(value);
    const img = imgRef.current;
    setItems((prev) =>
      prev.map((i) =>
        i.id === active?.id && img
          ? { ...i, crop: initialCrop(value, img.naturalWidth, img.naturalHeight) }
          : { ...i, crop: undefined }
      )
    );
  }

  /** Rotating or resetting changes the picture, so any earlier crop result is dropped. */
  function replaceWorkingUrl(item: CropItem, url: string): CropItem {
    if (item.workingUrl !== item.originalUrl && item.workingUrl !== url) URL.revokeObjectURL(item.workingUrl);
    if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
    return { ...item, workingUrl: url, crop: undefined, resultBlob: undefined, resultUrl: undefined };
  }

  async function rotate(direction: 1 | -1) {
    if (!active) return;
    const targets = bulk ? items : [active];
    setIsProcessing(true);
    try {
      const rotated = new Map<string, string>();
      for (const item of targets) {
        const bitmap = await loadImageBitmap(await (await fetch(item.workingUrl)).blob());
        const canvas = drawBitmapToCanvas(bitmap, bitmap.width, bitmap.height, direction * 90);
        bitmap.close();
        rotated.set(item.id, URL.createObjectURL(await canvasToBlob(canvas, "png", 1)));
      }
      setItems((prev) => prev.map((i) => (rotated.has(i.id) ? replaceWorkingUrl(i, rotated.get(i.id)!) : i)));
    } catch {
      setErrors(["Couldn't rotate this image."]);
    } finally {
      setIsProcessing(false);
    }
  }

  function resetRotation() {
    const targetIds = new Set(bulk ? items.map((i) => i.id) : active ? [active.id] : []);
    setItems((prev) =>
      prev.map((i) =>
        targetIds.has(i.id) && i.workingUrl !== i.originalUrl ? replaceWorkingUrl(i, i.originalUrl) : i
      )
    );
  }

  async function cropImages() {
    if (!active?.crop || active.crop.width === 0 || active.crop.height === 0) {
      setErrors(["Select a crop area first."]);
      return;
    }
    setErrors([]);
    setIsProcessing(true);
    const crop = active.crop;
    const targets = bulk ? itemsRef.current : [active];
    for (const item of targets) {
      try {
        const blob = await cropImage(item, bulk ? crop : item.crop ?? crop, aspect);
        const resultUrl = URL.createObjectURL(blob);
        setItems((prev) =>
          prev.map((i) => {
            if (i.id !== item.id) return i;
            if (i.resultUrl) URL.revokeObjectURL(i.resultUrl);
            return { ...i, resultBlob: blob, resultUrl, error: undefined };
          })
        );
      } catch (error) {
        patchItem(item.id, {
          error: error instanceof Error ? error.message : "Failed to crop this image.",
        });
      }
    }
    setIsProcessing(false);
    if (!bulk) {
      // Jump to the next image that still needs cropping.
      const next = itemsRef.current.find((i) => i.id !== active.id && !i.resultBlob);
      if (next) setActiveId(next.id);
    }
  }

  function removeItem(id: string) {
    const item = items.find((i) => i.id === id);
    if (item) revokeItem(item);
    const rest = items.filter((i) => i.id !== id);
    setItems(rest);
    if (activeId === id) setActiveId(rest[0]?.id ?? null);
  }

  function reset() {
    items.forEach(revokeItem);
    setItems([]);
    setActiveId(null);
    setErrors([]);
  }

  function resultImage(item: CropItem) {
    return { baseName: `${stripExtension(item.file.name)}-cropped`, blob: item.resultBlob! };
  }

  const dropzone = (
    <FileDropzone
      accept="image/jpeg,image/png,image/webp"
      acceptedMimeTypes={["image/jpeg", "image/png", "image/webp"]}
      acceptedFormatsLabel={tool.acceptedFormats.join(", ")}
      maxSizeMB={tool.maxFileSizeMB}
      multiple
      onFilesAccepted={handleFilesAccepted}
      onFilesRejected={setErrors}
    />
  );

  if (!active) {
    return (
      <div className="space-y-4">
        {dropzone}
        <ErrorBanner messages={errors} title="Couldn't add that file" />
      </div>
    );
  }

  const itemErrors = items.filter((i) => i.error).map((i) => `${i.file.name}: ${i.error}`);

  return (
    <div className="space-y-5">
      {dropzone}

      <ul className="flex gap-2 overflow-x-auto pb-1" aria-label="Images">
        {items.map((item, index) => (
          <li key={item.id} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setActiveId(item.id)}
              aria-label={`Edit image ${index + 1}: ${item.file.name}`}
              aria-current={item.id === active.id}
              className={`block size-20 overflow-hidden rounded-lg border-2 bg-muted ${
                item.id === active.id ? "border-primary" : "border-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.resultUrl ?? item.workingUrl} alt="" className="size-full object-cover" />
            </button>
            {item.resultBlob && (
              <CheckCircle2
                className="absolute bottom-1 left-1 size-4 rounded-full bg-background text-primary"
                aria-label="Cropped"
              />
            )}
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              disabled={isProcessing}
              aria-label={`Remove ${item.file.name}`}
              className="absolute top-1 right-1 rounded-full bg-background/90 p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4">
        {items.length > 1 && (
          <div className="flex w-full items-center gap-2">
            <Switch id="apply-all" checked={applyToAll} onCheckedChange={setApplyToAll} />
            <Label htmlFor="apply-all">
              Apply crop &amp; rotation to all {items.length} images at once
            </Label>
          </div>
        )}

        <div>
          <Label>Aspect ratio</Label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {ASPECT_PRESETS.map((preset) => (
              <Button
                key={preset.label}
                type="button"
                size="sm"
                variant={aspect === preset.value ? "default" : "outline"}
                onClick={() => changeAspect(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label>{bulk ? "Rotate all" : "Rotate"}</Label>
          <div className="mt-2 flex gap-1.5">
            <Button
              type="button"
              size="icon"
              variant="outline"
              aria-label="Rotate left"
              disabled={isProcessing}
              onClick={() => rotate(-1)}
            >
              <RotateCcw className="size-4" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              aria-label="Rotate right"
              disabled={isProcessing}
              onClick={() => rotate(1)}
            >
              <RotateCw className="size-4" aria-hidden="true" />
            </Button>
            <Button type="button" size="sm" variant="ghost" disabled={isProcessing} onClick={resetRotation}>
              Reset
            </Button>
          </div>
        </div>
      </div>

      <ErrorBanner messages={[...errors, ...itemErrors]} />

      <div className="flex justify-center rounded-xl border border-border bg-muted/30 p-4">
        <ReactCrop
          crop={active.crop}
          onChange={(_, percentCrop) => patchItem(active.id, { crop: percentCrop })}
          aspect={aspect}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={active.workingUrl}
            alt={`Editing ${active.file.name}`}
            onLoad={onImageLoad}
            className="max-h-[480px]"
          />
        </ReactCrop>
      </div>
      {bulk && (
        <p className="-mt-3 text-center text-xs text-muted-foreground">
          This crop area is applied to every image in the same position.
          {aspect ? " Images with a different shape keep the chosen aspect ratio." : ""}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={cropImages} disabled={isProcessing}>
          {isProcessing ? "Working…" : bulk ? `Crop all ${items.length} images` : "Crop this image"}
        </Button>
        {active.resultBlob && (
          <Button
            type="button"
            variant="outline"
            onClick={() => downloadImage(resultImage(active), downloadFormat)}
          >
            <Download aria-hidden="true" />
            Download this image
          </Button>
        )}
      </div>

      {active.resultUrl && (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm font-medium">Cropped preview</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={active.resultUrl} alt="" className="mt-2 max-h-72 rounded-lg border border-border object-contain" />
        </div>
      )}

      {!isProcessing && (
        <BulkDownloadPanel
          images={doneItems.map(resultImage)}
          totalCount={items.length}
          format={downloadFormat}
          onFormatChange={setDownloadFormat}
          zipName="cropped-images.zip"
          onReset={reset}
        />
      )}
    </div>
  );
}
