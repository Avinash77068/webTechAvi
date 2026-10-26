"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop, type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { FlipHorizontal2, RotateCcw, RotateCw, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ErrorBanner } from "@/components/tools/error-banner";
import { ResultActions } from "@/components/tools/result-actions";
import { downloadBlob } from "@/lib/download";
import { formatBytes, stripExtension } from "@/lib/validation";
import {
  canvasToBlob,
  encodeUnderLimit,
  flattenOnWhite,
  formatToExtension,
  loadImageBitmap,
  type OutputImageFormat,
} from "@/lib/image/canvas-utils";
import { applyAdjust, isNeutral, NO_ADJUST, type Adjust } from "@/lib/image/pixels";
import { getToolBySlug } from "@/lib/tools-registry";
import { ASPECT_PRESETS, PREVIEW_MAX_SIDE } from "../constants";

const tool = getToolBySlug("photo-editor")!;

function initialCrop(aspect: number | undefined, width: number, height: number): Crop {
  if (!aspect) return { unit: "%", x: 0, y: 0, width: 100, height: 100 };
  return centerCrop(makeAspectCrop({ unit: "%", width: 90 }, aspect, width, height), width, height);
}

/** The bitmap turned in 90° steps and optionally mirrored, at full resolution. */
function transformedCanvas(bitmap: ImageBitmap, quarterTurns: number, flipH: boolean): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const sideways = quarterTurns % 2 === 1;
  canvas.width = sideways ? bitmap.height : bitmap.width;
  canvas.height = sideways ? bitmap.width : bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((quarterTurns * Math.PI) / 2);
  if (flipH) ctx.scale(-1, 1);
  ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);
  return canvas;
}

function AdjustSlider({
  id,
  label,
  value,
  min,
  max,
  disabled,
  valueText,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  disabled?: boolean;
  valueText?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <Label id={id}>{label}</Label>
        <span className="tabular-nums text-muted-foreground">{valueText ?? value}</span>
      </div>
      <Slider
        aria-labelledby={id}
        className="mt-2"
        min={min}
        max={max}
        step={1}
        disabled={disabled}
        value={[value]}
        onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
      />
    </div>
  );
}

export function PhotoEditorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [quarterTurns, setQuarterTurns] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [adjust, setAdjust] = useState<Adjust>(NO_ADJUST);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [crop, setCrop] = useState<Crop>();
  const [percentCrop, setPercentCrop] = useState<Crop>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [baseVersion, setBaseVersion] = useState(0);
  const [format, setFormat] = useState<OutputImageFormat>("jpeg");
  const [quality, setQuality] = useState(90);
  const [limitOn, setLimitOn] = useState(false);
  const [maxKB, setMaxKB] = useState("50");
  const [exporting, setExporting] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string; width: number; height: number } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const bitmapRef = useRef<ImageBitmap | null>(null);
  const baseRef = useRef<HTMLCanvasElement | null>(null);
  const aspectRef = useRef(aspect);
  useEffect(() => {
    aspectRef.current = aspect;
  }, [aspect]);

  const clearResult = useCallback(() => {
    setResult((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
  }, []);

  async function handleFilesAccepted(files: File[]) {
    const picked = files[0];
    if (!picked) return;
    setErrors([]);
    try {
      const bitmap = await loadImageBitmap(picked);
      bitmapRef.current?.close();
      bitmapRef.current = bitmap;
      setFile(picked);
      setQuarterTurns(0);
      setFlipH(false);
      setAdjust(NO_ADJUST);
      setAspect(undefined);
      clearResult();
      setFormat(picked.type === "image/png" ? "png" : picked.type === "image/webp" ? "webp" : "jpeg");
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Couldn't load this image."]);
    }
  }

  // Rebuild the full-size working image when the file, rotation or mirror changes.
  useEffect(() => {
    const bitmap = bitmapRef.current;
    if (!file || !bitmap) return;
    baseRef.current = transformedCanvas(bitmap, quarterTurns, flipH);
    const { width, height } = baseRef.current;
    const next = initialCrop(aspectRef.current, width, height);
    setCrop(next);
    setPercentCrop(next);
    setBaseVersion((v) => v + 1);
    clearResult();
  }, [file, quarterTurns, flipH, clearResult]);

  // Preview: a downscaled copy with the light and colour changes applied (debounced).
  useEffect(() => {
    const base = baseRef.current;
    if (!base) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      const k = Math.min(1, PREVIEW_MAX_SIDE / Math.max(base.width, base.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(base.width * k));
      canvas.height = Math.max(1, Math.round(base.height * k));
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(base, 0, 0, canvas.width, canvas.height);
      if (!isNeutral(adjust)) {
        const px = ctx.getImageData(0, 0, canvas.width, canvas.height);
        applyAdjust(px.data, adjust);
        ctx.putImageData(px, 0, 0);
      }
      const blob = await canvasToBlob(canvas, "jpeg", 0.92);
      if (cancelled) return;
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
      clearResult();
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [baseVersion, adjust, clearResult]);

  useEffect(
    () => () => {
      bitmapRef.current?.close();
    },
    []
  );

  function changeAspect(value: number | undefined) {
    setAspect(value);
    const base = baseRef.current;
    if (!base) return;
    const next = initialCrop(value, base.width, base.height);
    setCrop(next);
    setPercentCrop(next);
    clearResult();
  }

  function patch(values: Partial<Adjust>) {
    setAdjust((a) => ({ ...a, ...values }));
  }

  async function exportImage() {
    const base = baseRef.current;
    const area = percentCrop;
    if (!base || !area || !area.width || !area.height) {
      setErrors(["Select a crop area first."]);
      return;
    }
    setErrors([]);
    setExporting(true);
    try {
      const sx = Math.round((area.x / 100) * base.width);
      const sy = Math.round((area.y / 100) * base.height);
      const sw = Math.max(1, Math.min(base.width - sx, Math.round((area.width / 100) * base.width)));
      const sh = Math.max(1, Math.min(base.height - sy, Math.round((area.height / 100) * base.height)));
      let canvas = document.createElement("canvas");
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("Canvas is not supported in this browser.");
      ctx.drawImage(base, sx, sy, sw, sh, 0, 0, sw, sh);
      const px = ctx.getImageData(0, 0, sw, sh);
      applyAdjust(px.data, adjust);
      ctx.putImageData(px, 0, 0);

      let blob: Blob;
      const limitBytes = limitOn && format !== "png" ? Number(maxKB) * 1000 : null;
      if (limitOn && format !== "png" && (!Number.isFinite(limitBytes) || !limitBytes || limitBytes < 5000)) {
        throw new Error("Enter a size limit of at least 5 KB.");
      }
      if (format === "png") {
        blob = await canvasToBlob(canvas, "png", 1);
      } else {
        if (format === "jpeg") canvas = flattenOnWhite(canvas);
        if (limitBytes) {
          const out = await encodeUnderLimit(canvas, format, quality / 100, limitBytes);
          blob = out.blob;
          canvas = out.canvas;
        } else {
          blob = await canvasToBlob(canvas, format, quality / 100);
        }
      }
      setResult((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return { blob, url: URL.createObjectURL(blob), width: canvas.width, height: canvas.height };
      });
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Failed to edit this image."]);
    } finally {
      setExporting(false);
    }
  }

  function reset() {
    bitmapRef.current?.close();
    bitmapRef.current = null;
    baseRef.current = null;
    setFile(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    clearResult();
    setCrop(undefined);
    setPercentCrop(undefined);
    setAdjust(NO_ADJUST);
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
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4">
            <div>
              <Label>Crop shape</Label>
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
              <Label>Rotate and flip</Label>
              <div className="mt-2 flex gap-1.5">
                <Button type="button" size="icon" variant="outline" aria-label="Rotate left" onClick={() => setQuarterTurns((q) => (q + 3) % 4)}>
                  <RotateCcw className="size-4" aria-hidden="true" />
                </Button>
                <Button type="button" size="icon" variant="outline" aria-label="Rotate right" onClick={() => setQuarterTurns((q) => (q + 1) % 4)}>
                  <RotateCw className="size-4" aria-hidden="true" />
                </Button>
                <Button type="button" size="icon" variant={flipH ? "default" : "outline"} aria-label="Flip horizontally" aria-pressed={flipH} onClick={() => setFlipH((f) => !f)}>
                  <FlipHorizontal2 className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>

          <ErrorBanner messages={errors} />

          <div className="flex justify-center rounded-xl border border-border bg-muted/30 p-4">
            {previewUrl ? (
              <ReactCrop
                crop={crop}
                onChange={(_, pct) => setCrop(pct)}
                onComplete={(_, pct) => {
                  setPercentCrop(pct);
                  clearResult();
                }}
                aspect={aspect}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Photo being edited" className="max-h-[520px]" />
              </ReactCrop>
            ) : (
              <p className="py-16 text-sm text-muted-foreground">Preparing preview…</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <section className="space-y-4 rounded-xl border border-border bg-card p-4" aria-label="Light and colour">
            <h2 className="text-sm font-semibold">Light and colour</h2>
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label htmlFor="auto-enhance">Auto enhance</Label>
                <p className="text-xs text-muted-foreground">Fixes a dull or dark photo.</p>
              </div>
              <Switch id="auto-enhance" checked={adjust.auto} onCheckedChange={(v) => patch({ auto: v })} />
            </div>
            <AdjustSlider id="adj-brightness" label="Brightness" value={adjust.brightness} min={-100} max={100} onChange={(v) => patch({ brightness: v })} />
            <AdjustSlider id="adj-contrast" label="Contrast" value={adjust.contrast} min={-100} max={100} onChange={(v) => patch({ contrast: v })} />
            <AdjustSlider id="adj-saturation" label="Colour" value={adjust.saturation} min={-100} max={100} disabled={adjust.grayscale} onChange={(v) => patch({ saturation: v })} />
            <AdjustSlider
              id="adj-whiten"
              label="Whiten the background"
              value={adjust.whiten}
              min={0}
              max={100}
              valueText={adjust.whiten === 0 ? "Off" : String(adjust.whiten)}
              onChange={(v) => patch({ whiten: v })}
            />
            <p className="text-xs text-muted-foreground">Turns a light grey or cream wall white. Skin and hair are left alone. Start low.</p>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="grayscale">Black and white</Label>
              <Switch id="grayscale" checked={adjust.grayscale} onCheckedChange={(v) => patch({ grayscale: v })} />
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => setAdjust(NO_ADJUST)} disabled={isNeutral(adjust)}>
              <Wand2 aria-hidden="true" />
              Reset light and colour
            </Button>
          </section>

          <section className="space-y-4 rounded-xl border border-border bg-card p-4" aria-label="Save as">
            <h2 className="text-sm font-semibold">Save as</h2>
            <div>
              <Label htmlFor="save-format">Format</Label>
              <Select value={format} onValueChange={(v) => { setFormat(v as OutputImageFormat); clearResult(); }}>
                <SelectTrigger id="save-format" className="mt-2 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {format !== "png" && (
              <>
                <AdjustSlider id="save-quality" label="Quality" value={quality} min={40} max={100} disabled={limitOn} onChange={(v) => { setQuality(v); clearResult(); }} />
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <Label htmlFor="size-limit">Keep under a size limit</Label>
                    <p className="text-xs text-muted-foreground">For forms that say &ldquo;maximum 50 KB&rdquo;.</p>
                  </div>
                  <Switch id="size-limit" checked={limitOn} onCheckedChange={(v) => { setLimitOn(v); clearResult(); }} />
                </div>
                {limitOn && (
                  <div>
                    <Label htmlFor="max-kb">Maximum size (KB)</Label>
                    <Input id="max-kb" className="mt-2" type="number" inputMode="decimal" min={5} value={maxKB} onChange={(e) => { setMaxKB(e.target.value); clearResult(); }} />
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>

      {result && (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm font-medium">
            Edited photo &middot; {result.width}&times;{result.height} px &middot; {formatBytes(result.blob.size)}
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={result.url} alt="Edited photo preview" className="mt-2 max-h-72 rounded-lg border border-border object-contain" />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {!result ? (
          <>
            <Button type="button" onClick={exportImage} disabled={exporting}>
              {exporting ? "Saving…" : "Apply and preview"}
            </Button>
            <Button type="button" variant="outline" onClick={reset}>
              Choose a different image
            </Button>
          </>
        ) : (
          <ResultActions
            onDownload={() => downloadBlob(result.blob, `${stripExtension(file.name)}-edited.${formatToExtension[format]}`)}
            onReset={reset}
            resetLabel="Edit another photo"
          />
        )}
      </div>
    </div>
  );
}
