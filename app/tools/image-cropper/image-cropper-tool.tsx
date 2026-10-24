"use client";

import { useRef, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop, cropToCanvas, type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RotateCcw, RotateCw } from "lucide-react";
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
import { sniffImageType, stripExtension } from "@/lib/validation";
import { downloadBlob } from "@/lib/download";
import {
  canvasToBlob,
  drawBitmapToCanvas,
  loadImageBitmap,
  formatToExtension,
  type OutputImageFormat,
} from "@/lib/image/canvas-utils";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("image-cropper")!;

const ASPECT_PRESETS: { label: string; value: number | undefined }[] = [
  { label: "Free", value: undefined },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:4", value: 3 / 4 },
  { label: "9:16", value: 9 / 16 },
];

function initialCrop(aspect: number | undefined, width: number, height: number): Crop {
  const base = { unit: "%" as const, width: 80 };
  const crop = aspect ? makeAspectCrop(base, aspect, width, height) : { ...base, height: 80, x: 0, y: 0 };
  return centerCrop(crop, width, height);
}

export function ImageCropperTool() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [workingUrl, setWorkingUrl] = useState<string | null>(null);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [outputFormat, setOutputFormat] = useState<OutputImageFormat>("png");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const imgRef = useRef<HTMLImageElement>(null);

  async function handleFilesAccepted(files: File[]) {
    const picked = files[0];
    if (!picked) return;
    setErrors([]);
    setResultBlob(null);
    setResultUrl(null);
    try {
      await loadImageBitmap(picked); // validates decodability up front
      const sniffed = await sniffImageType(picked);
      setOutputFormat(sniffed === "jpeg" ? "jpeg" : sniffed === "webp" ? "webp" : "png");
      const url = URL.createObjectURL(picked);
      setFile(picked);
      setOriginalUrl(url);
      setWorkingUrl(url);
      setCrop(undefined);
      setCompletedCrop(undefined);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Couldn't load this image."]);
    }
  }

  function onImageLoad(event: React.SyntheticEvent<HTMLImageElement>) {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    setCrop(initialCrop(aspect, naturalWidth, naturalHeight));
  }

  function changeAspect(value: number | undefined) {
    setAspect(value);
    if (imgRef.current) {
      setCrop(initialCrop(value, imgRef.current.naturalWidth, imgRef.current.naturalHeight));
    }
  }

  async function rotate(direction: 1 | -1) {
    if (!workingUrl) return;
    try {
      const response = await fetch(workingUrl);
      const blob = await response.blob();
      const bitmap = await loadImageBitmap(blob);
      const canvas = drawBitmapToCanvas(bitmap, bitmap.width, bitmap.height, direction * 90);
      const rotatedBlob = await canvasToBlob(canvas, "png", 1);
      const newUrl = URL.createObjectURL(rotatedBlob);
      if (workingUrl !== originalUrl) URL.revokeObjectURL(workingUrl);
      setWorkingUrl(newUrl);
      setCrop(undefined);
      setCompletedCrop(undefined);
    } catch {
      setErrors(["Couldn't rotate this image."]);
    }
  }

  function resetRotation() {
    if (!originalUrl) return;
    if (workingUrl && workingUrl !== originalUrl) URL.revokeObjectURL(workingUrl);
    setWorkingUrl(originalUrl);
    setCrop(undefined);
    setCompletedCrop(undefined);
  }

  async function exportCrop() {
    if (!imgRef.current || !completedCrop || completedCrop.width === 0 || completedCrop.height === 0) {
      setErrors(["Select a crop area first."]);
      return;
    }
    setErrors([]);
    try {
      const canvas = document.createElement("canvas");
      await cropToCanvas(imgRef.current, canvas, completedCrop);
      const blob = await canvasToBlob(canvas, outputFormat, 0.92);
      setResultBlob(blob);
      setResultUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Failed to crop this image."]);
    }
  }

  function reset() {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (workingUrl && workingUrl !== originalUrl) URL.revokeObjectURL(workingUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setOriginalUrl(null);
    setWorkingUrl(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setResultBlob(null);
    setResultUrl(null);
    setErrors([]);
  }

  if (!file || !workingUrl) {
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
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4">
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
          <Label>Rotate</Label>
          <div className="mt-2 flex gap-1.5">
            <Button type="button" size="icon" variant="outline" aria-label="Rotate left" onClick={() => rotate(-1)}>
              <RotateCcw className="size-4" aria-hidden="true" />
            </Button>
            <Button type="button" size="icon" variant="outline" aria-label="Rotate right" onClick={() => rotate(1)}>
              <RotateCw className="size-4" aria-hidden="true" />
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={resetRotation}>
              Reset
            </Button>
          </div>
        </div>

        <div className="ml-auto">
          <Label htmlFor="export-format">Export as</Label>
          <Select value={outputFormat} onValueChange={(value) => setOutputFormat(value as OutputImageFormat)}>
            <SelectTrigger id="export-format" className="mt-2 w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpeg">JPEG</SelectItem>
              <SelectItem value="webp">WebP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ErrorBanner messages={errors} />

      <div className="flex justify-center rounded-xl border border-border bg-muted/30 p-4">
        <ReactCrop crop={crop} onChange={(_, percentCrop) => setCrop(percentCrop)} onComplete={(c) => setCompletedCrop(c)} aspect={aspect}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={imgRef} src={workingUrl} alt="" onLoad={onImageLoad} className="max-h-[480px]" />
        </ReactCrop>
      </div>

      {resultBlob && resultUrl && (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm font-medium">Cropped preview</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={resultUrl} alt="" className="mt-2 max-h-72 rounded-lg border border-border object-contain" />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {!resultBlob ? (
          <>
            <Button type="button" onClick={exportCrop}>
              Crop image
            </Button>
            <Button type="button" variant="outline" onClick={reset}>
              Choose a different image
            </Button>
          </>
        ) : (
          <ResultActions
            onDownload={() =>
              downloadBlob(resultBlob, `${stripExtension(file.name)}-cropped.${formatToExtension[outputFormat]}`)
            }
            onReset={reset}
          />
        )}
      </div>
    </div>
  );
}
