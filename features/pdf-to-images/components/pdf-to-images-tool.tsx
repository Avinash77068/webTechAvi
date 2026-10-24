"use client";

import { useEffect, useState } from "react";
import { Download, FileArchive } from "lucide-react";
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
import { SelectablePageGrid, type PageThumb } from "@/components/tools/pdf/selectable-page-grid";
import { formatBytes, sniffIsPdf, stripExtension } from "@/lib/validation";
import { downloadBlob } from "@/lib/download";
import { loadPdfDocument, renderPdfPageThumbnail, renderPdfPageToCanvas, type PdfDocumentHandle } from "@/lib/pdf/pdfjs-client";
import { canvasToBlob, formatToExtension, type OutputImageFormat } from "@/lib/image/canvas-utils";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("pdf-to-images")!;

interface ExportedImage {
  pageNumber: number;
  blob: Blob;
  url: string;
}

export function PdfToImagesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [doc, setDoc] = useState<PdfDocumentHandle | null>(null);
  const [pages, setPages] = useState<PageThumb[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [format, setFormat] = useState<OutputImageFormat>("jpeg");
  const [scale, setScale] = useState("2");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [results, setResults] = useState<ExportedImage[]>([]);

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
      const thumbs: PageThumb[] = [];
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const { dataUrl } = await renderPdfPageThumbnail(pdfDoc, i, 220);
        thumbs.push({ pageNumber: i, dataUrl });
      }
      setFile(picked);
      setDoc(pdfDoc);
      setPages(thumbs);
      setSelected(new Set(Array.from({ length: pdfDoc.numPages }, (_, i) => i + 1)));
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Couldn't open this PDF."]);
    } finally {
      setIsLoading(false);
    }
  }

  function toggle(pageNumber: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(pageNumber)) next.delete(pageNumber);
      else next.add(pageNumber);
      return next;
    });
  }

  async function runExport() {
    if (!doc || selected.size === 0) {
      setErrors(["Select at least one page."]);
      return;
    }
    setErrors([]);
    setIsProcessing(true);
    try {
      const sortedPages = Array.from(selected).sort((a, b) => a - b);
      const exported: ExportedImage[] = [];
      for (const pageNumber of sortedPages) {
        const canvas = await renderPdfPageToCanvas(doc, pageNumber, Number(scale));
        const blob = await canvasToBlob(canvas, format, 0.9);
        exported.push({ pageNumber, blob, url: URL.createObjectURL(blob) });
      }
      setResults(exported);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Failed to export these pages."]);
    } finally {
      setIsProcessing(false);
    }
  }

  async function downloadAllAsZip() {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    for (const result of results) {
      zip.file(`page-${result.pageNumber}.${formatToExtension[format]}`, result.blob);
    }
    const zipBlob = await zip.generateAsync({ type: "blob" });
    downloadBlob(zipBlob, `${file ? stripExtension(file.name) : "pages"}-images.zip`);
  }

  function reset() {
    for (const result of results) URL.revokeObjectURL(result.url);
    setFile(null);
    setDoc(null);
    setPages([]);
    setSelected(new Set());
    setResults([]);
    setErrors([]);
  }

  if (results.length > 0) {
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" onClick={downloadAllAsZip}>
            <FileArchive aria-hidden="true" />
            Download all as ZIP
          </Button>
          <Button type="button" variant="outline" onClick={reset}>
            Start over
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {results.map((result) => (
            <div key={result.pageNumber} className="overflow-hidden rounded-xl border border-border bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.url} alt={`Page ${result.pageNumber}`} className="w-full bg-muted/20" />
              <div className="flex items-center justify-between gap-2 p-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium">Page {result.pageNumber}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(result.blob.size)}</p>
                </div>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="outline"
                  aria-label={`Download page ${result.pageNumber}`}
                  onClick={() =>
                    downloadBlob(
                      result.blob,
                      `${file ? stripExtension(file.name) : "page"}-${result.pageNumber}.${formatToExtension[format]}`
                    )
                  }
                >
                  <Download className="size-3.5" aria-hidden="true" />
                </Button>
              </div>
            </div>
          ))}
        </div>
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
        {isLoading && <ProcessingProgress label="Loading pages…" />}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => setSelected(new Set(pages.map((p) => p.pageNumber)))}>
            Select all
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setSelected(new Set())}>
            Clear
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="img-format" className="shrink-0 text-sm">
              Format
            </Label>
            <Select value={format} onValueChange={(v) => setFormat(v as OutputImageFormat)}>
              <SelectTrigger id="img-format" className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jpeg">JPEG</SelectItem>
                <SelectItem value="png">PNG</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="img-scale" className="shrink-0 text-sm">
              Resolution
            </Label>
            <Select value={scale} onValueChange={(value) => value && setScale(value)}>
              <SelectTrigger id="img-scale" className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Standard</SelectItem>
                <SelectItem value="2">High</SelectItem>
                <SelectItem value="3">Very high</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <ErrorBanner messages={errors} />

      <SelectablePageGrid pages={pages} selected={selected} onToggle={toggle} />

      {isProcessing && <ProcessingProgress label="Rendering images…" />}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={runExport} disabled={isProcessing || selected.size === 0}>
          {isProcessing ? "Rendering…" : `Export ${selected.size} page${selected.size === 1 ? "" : "s"}`}
        </Button>
        <Button type="button" variant="outline" onClick={reset}>
          Choose a different PDF
        </Button>
      </div>
    </div>
  );
}
