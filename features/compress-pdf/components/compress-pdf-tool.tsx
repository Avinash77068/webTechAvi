"use client";

import { useEffect, useState } from "react";
import { FileWarning } from "lucide-react";
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
import { formatBytes, sniffIsPdf, stripExtension } from "@/lib/validation";
import { downloadBlob } from "@/lib/download";
import { loadPdfDocument, renderPdfPageToCanvas, type PdfDocumentHandle } from "@/lib/pdf/pdfjs-client";
import { buildPdfFromImages, type NormalizedImageInput } from "@/lib/pdf/image-to-pdf";
import { canvasToBlob } from "@/lib/image/canvas-utils";
import { getToolBySlug } from "@/lib/tools-registry";
import { PRESETS, type PresetKey } from "../constants";

const tool = getToolBySlug("compress-pdf")!;

export function CompressPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [doc, setDoc] = useState<PdfDocumentHandle | null>(null);
  const [preset, setPreset] = useState<PresetKey>("balanced");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressLabel, setProgressLabel] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  useEffect(() => {
    return () => {
      doc?.cleanup();
    };
  }, [doc]);

  async function handleFilesAccepted(files: File[]) {
    const picked = files[0];
    if (!picked) return;
    if (!(await sniffIsPdf(picked))) {
      setErrors([`"${picked.name}" doesn't look like a valid PDF file.`]);
      return;
    }
    setErrors([]);
    setIsLoading(true);
    try {
      const pdfDoc = await loadPdfDocument(picked);
      setFile(picked);
      setDoc(pdfDoc);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Couldn't open this PDF."]);
    } finally {
      setIsLoading(false);
    }
  }

  async function compress() {
    if (!doc || !file) return;
    setErrors([]);
    setIsProcessing(true);
    try {
      const { scale, quality } = PRESETS[preset];
      const images: NormalizedImageInput[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        setProgressLabel(`Rendering page ${i} of ${doc.numPages}…`);
        const canvas = await renderPdfPageToCanvas(doc, i, scale);
        const blob = await canvasToBlob(canvas, "jpeg", quality);
        images.push({
          bytes: await blob.arrayBuffer(),
          kind: "jpeg",
          width: canvas.width,
          height: canvas.height,
        });
      }
      setProgressLabel("Rebuilding PDF…");
      const bytes = await buildPdfFromImages(images, { pageSize: "fit", orientation: "portrait" });
      setResultBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }));
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Failed to compress this PDF."]);
    } finally {
      setIsProcessing(false);
      setProgressLabel("");
    }
  }

  function reset() {
    setFile(null);
    setDoc(null);
    setResultBlob(null);
    setErrors([]);
  }

  if (resultBlob && file) {
    const isLarger = resultBlob.size >= file.size;
    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="font-medium">{file.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatBytes(file.size)} → {formatBytes(resultBlob.size)}{" "}
            <span className={isLarger ? "text-destructive" : "text-primary"}>
              ({isLarger ? "+" : "−"}
              {Math.abs(Math.round((1 - resultBlob.size / file.size) * 100))}%)
            </span>
          </p>
          {isLarger && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <FileWarning className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <p>
                This PDF got larger, not smaller — this happens with text-heavy PDFs, since
                rasterizing pages into images isn't always smaller than efficiently encoded text.
                Try "Smaller file" preset, or skip compressing this particular file.
              </p>
            </div>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            This file is now image-based — its text is no longer selectable or searchable.
          </p>
        </div>
        <ResultActions
          downloadLabel="Download PDF"
          onDownload={() => downloadBlob(resultBlob, `${stripExtension(file.name)}-compressed.pdf`)}
          onReset={reset}
        />
      </div>
    );
  }

  if (!file) {
    return (
      <div className="space-y-4">
        <FileDropzone
          accept="application/pdf"
          acceptedMimeTypes={["application/pdf"]}
          acceptedExtensions={[".pdf"]}
          acceptedFormatsLabel="PDF"
          maxSizeMB={tool.maxFileSizeMB}
          onFilesAccepted={handleFilesAccepted}
          onFilesRejected={setErrors}
        />
        <ErrorBanner messages={errors} />
        {isLoading && <ProcessingProgress label="Loading PDF…" />}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-medium">{file.name}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {doc?.numPages} pages · {formatBytes(file.size)}
        </p>
        <div className="mt-4 max-w-xs">
          <Label htmlFor="compress-preset">Compression level</Label>
          <Select value={preset} onValueChange={(v) => setPreset(v as PresetKey)}>
            <SelectTrigger id="compress-preset" className="mt-2 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PRESETS).map(([key, p]) => (
                <SelectItem key={key} value={key}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          This rebuilds every page as a compressed image. It removes selectable text and
          accessibility tags — best for scanned documents or photo-heavy PDFs.
        </p>
      </div>

      <ErrorBanner messages={errors} />

      {isProcessing && <ProcessingProgress label={progressLabel || "Compressing…"} />}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={compress} disabled={isProcessing}>
          {isProcessing ? "Compressing…" : "Compress PDF"}
        </Button>
        <Button type="button" variant="outline" onClick={reset}>
          Choose a different PDF
        </Button>
      </div>
    </div>
  );
}
