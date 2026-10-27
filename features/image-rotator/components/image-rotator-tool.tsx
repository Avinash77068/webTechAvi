"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, RotateCcw, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ErrorBanner } from "@/components/tools/error-banner";
import { formatBytes, sniffImageType, stripExtension } from "@/lib/validation";
import {
  BulkDownloadPanel,
  downloadImage,
  type DownloadFormat,
} from "@/components/tools/bulk-download-panel";
import { canvasToBlob, loadImageBitmap, type OutputImageFormat } from "@/lib/image/canvas-utils";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("image-rotator")!;

const PRESET_ANGLES = [-90, 90, 180, 270];

interface RotateItem {
  id: string;
  file: File;
  previewUrl: string;
  selected: boolean;
  status: "pending" | "processing" | "done" | "error";
  resultBlob?: Blob;
  resultUrl?: string;
  appliedAngle?: number;
  error?: string;
}

async function detectedFormat(file: File): Promise<OutputImageFormat> {
  const sniffed = await sniffImageType(file);
  if (sniffed === "png") return "png";
  if (sniffed === "webp") return "webp";
  return "jpeg";
}

/** Rotates by any angle; the canvas grows to fit the rotated image so no corner is cut off. */
function rotateBitmap(bitmap: ImageBitmap, angleDeg: number, fillWhite: boolean): HTMLCanvasElement {
  const rad = (angleDeg * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * cos + bitmap.height * sin));
  canvas.height = Math.max(1, Math.round(bitmap.width * sin + bitmap.height * cos));

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");

  if (fillWhite) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.imageSmoothingQuality = "high";
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rad);
  ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);
  return canvas;
}

export function ImageRotatorTool() {
  const [items, setItems] = useState<RotateItem[]>([]);
  const [angleInput, setAngleInput] = useState("90");
  const [rejectedErrors, setRejectedErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>("keep");
  const itemsRef = useRef<RotateItem[]>([]);

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

  const parsedAngle = Number(angleInput);
  const angleValid = angleInput.trim() !== "" && Number.isFinite(parsedAngle) && Math.abs(parsedAngle) <= 360;
  const angle = angleValid ? parsedAngle : 0;
  const selectedCount = items.filter((i) => i.selected).length;
  const doneItems = items.filter((i) => i.status === "done" && i.resultBlob);

  function handleFilesAccepted(files: File[]) {
    setRejectedErrors([]);
    const newItems: RotateItem[] = files.map((file) => ({
      id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
      file,
      previewUrl: URL.createObjectURL(file),
      selected: true,
      status: "pending",
    }));
    setItems((prev) => [...prev, ...newItems]);
  }

  function toggleItem(id: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i)));
  }

  function setAllSelected(selected: boolean) {
    setItems((prev) => prev.map((i) => ({ ...i, selected })));
  }

  function nudgeAngle(delta: number) {
    const next = (((angle + delta) % 360) + 360) % 360;
    setAngleInput(String(next));
  }

  async function rotateSelected() {
    if (!angleValid) return;
    setIsProcessing(true);
    const rotation = angle;
    for (const item of itemsRef.current) {
      if (!item.selected) continue;
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: "processing", error: undefined } : i))
      );
      try {
        const bitmap = await loadImageBitmap(item.file);
        const outputFormat = await detectedFormat(item.file);
        const canvas = rotateBitmap(bitmap, rotation, outputFormat === "jpeg");
        bitmap.close();
        const blob = await canvasToBlob(canvas, outputFormat, 0.92);
        const resultUrl = URL.createObjectURL(blob);
        setItems((prev) =>
          prev.map((i) => {
            if (i.id !== item.id) return i;
            if (i.resultUrl) URL.revokeObjectURL(i.resultUrl);
            return {
              ...i,
              status: "done",
              resultBlob: blob,
              resultUrl,
              appliedAngle: rotation,
            };
          })
        );
      } catch (error) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: "error", error: error instanceof Error ? error.message : "Failed to rotate this image." }
              : i
          )
        );
      }
    }
    setIsProcessing(false);
  }

  // Show the rotated output unless the item is selected and the angle has since changed,
  // in which case the original gets a live CSS preview of the new angle.
  function showsResult(item: RotateItem) {
    return item.status === "done" && !!item.resultUrl && (!item.selected || item.appliedAngle === angle);
  }

  function resultImage(item: RotateItem) {
    return { baseName: `${stripExtension(item.file.name)}-rotated`, blob: item.resultBlob! };
  }

  function removeItem(id: string) {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        URL.revokeObjectURL(item.previewUrl);
        if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  }

  function reset() {
    for (const item of items) {
      URL.revokeObjectURL(item.previewUrl);
      if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
    }
    setItems([]);
    setRejectedErrors([]);
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
        onFilesRejected={setRejectedErrors}
      />

      <ErrorBanner messages={rejectedErrors} title="Some files couldn't be added" />

      {items.length > 0 && (
        <>
          <div className="space-y-3 rounded-xl border border-border bg-card p-4">
            <div>
              <Label htmlFor="angle-input">Rotation angle (degrees, clockwise)</Label>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  aria-label="Rotate 90° left"
                  onClick={() => nudgeAngle(-90)}
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                </Button>
                <Input
                  id="angle-input"
                  type="number"
                  inputMode="decimal"
                  min={-360}
                  max={360}
                  step={1}
                  value={angleInput}
                  onChange={(e) => setAngleInput(e.target.value)}
                  aria-invalid={!angleValid}
                  className="w-24"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  aria-label="Rotate 90° right"
                  onClick={() => nudgeAngle(90)}
                >
                  <RotateCw className="size-4" aria-hidden="true" />
                </Button>
                {PRESET_ANGLES.map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    size="sm"
                    variant={angleValid && angle === preset ? "default" : "ghost"}
                    onClick={() => setAngleInput(String(preset))}
                  >
                    {preset}°
                  </Button>
                ))}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {angleValid
                  ? "Use a negative number to rotate counter-clockwise. Angles that aren't a multiple of 90° enlarge the canvas to fit — JPEG corners are filled white, PNG/WebP stay transparent."
                  : "Enter a number between -360 and 360."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              onClick={rotateSelected}
              disabled={isProcessing || selectedCount === 0 || !angleValid}
            >
              {isProcessing ? "Rotating…" : `Rotate ${selectedCount} selected`}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setAllSelected(selectedCount !== items.length)}
            >
              {selectedCount === items.length ? "Select none" : "Select all"}
            </Button>
            <Button type="button" variant="outline" onClick={reset}>
              Clear all
            </Button>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li
                key={item.id}
                className={`flex flex-col gap-3 rounded-xl border bg-card p-3 ${
                  item.selected ? "border-primary" : "border-border"
                }`}
              >
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleItem(item.id)}
                    className="size-4 accent-primary"
                  />
                  <span className="truncate font-medium">{item.file.name}</span>
                </label>
                <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={showsResult(item) ? item.resultUrl : item.previewUrl}
                    alt={`Preview of ${item.file.name}`}
                    className="max-h-[70%] max-w-[70%] object-contain transition-transform duration-300"
                    style={
                      item.selected && !showsResult(item)
                        ? { transform: `rotate(${angle}deg)` }
                        : undefined
                    }
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 text-xs text-muted-foreground">
                    <p>
                      {formatBytes(item.file.size)}
                      {item.status === "done" && item.resultBlob && (
                        <> → {formatBytes(item.resultBlob.size)}</>
                      )}
                    </p>
                    {item.status === "done" && <p className="text-primary">Rotated {item.appliedAngle}°</p>}
                    {item.status === "processing" && <p className="text-primary">Rotating…</p>}
                    {item.status === "error" && <p className="text-destructive">{item.error}</p>}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {item.status === "done" && (
                      <Button type="button" size="sm" onClick={() => downloadImage(resultImage(item), downloadFormat)}>
                        Download
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={isProcessing}
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {!isProcessing && (
            <BulkDownloadPanel
              images={doneItems.map(resultImage)}
              totalCount={items.length}
              format={downloadFormat}
              onFormatChange={setDownloadFormat}
              zipName="rotated-images.zip"
              onReset={reset}
            />
          )}
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
