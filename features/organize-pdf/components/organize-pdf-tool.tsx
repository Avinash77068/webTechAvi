"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, RotateCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ErrorBanner } from "@/components/tools/error-banner";
import { ProcessingProgress } from "@/components/tools/processing-progress";
import { ResultActions } from "@/components/tools/result-actions";
import { sniffIsPdf, stripExtension } from "@/lib/validation";
import { downloadBlob } from "@/lib/download";
import { loadPdfDocument, renderPdfPageThumbnail } from "@/lib/pdf/pdfjs-client";
import { organizePdfPages, type PageOperation } from "@/lib/pdf/pdf-lib-utils";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("organize-pdf")!;

interface PageItem {
  id: string;
  originalIndex: number;
  dataUrl: string;
  rotationDelta: number;
}

export function OrganizePdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState<PageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

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
      const doc = await loadPdfDocument(picked);
      const next: PageItem[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const { dataUrl } = await renderPdfPageThumbnail(doc, i, 220);
        next.push({ id: `page-${i}`, originalIndex: i - 1, dataUrl, rotationDelta: 0 });
      }
      setFile(picked);
      setItems(next);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Couldn't open this PDF."]);
    } finally {
      setIsLoading(false);
    }
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

  function rotate(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, rotationDelta: (item.rotationDelta + 90) % 360 } : item
      )
    );
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  async function exportPdf() {
    if (!file || items.length === 0) {
      setErrors(["Keep at least one page."]);
      return;
    }
    setErrors([]);
    setIsProcessing(true);
    try {
      const operations: PageOperation[] = items.map((item) => ({
        originalIndex: item.originalIndex,
        rotationDelta: item.rotationDelta,
      }));
      const bytes = await organizePdfPages(file, operations);
      setResultBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }));
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Failed to export this PDF."]);
    } finally {
      setIsProcessing(false);
    }
  }

  function reset() {
    setFile(null);
    setItems([]);
    setResultBlob(null);
    setErrors([]);
  }

  if (resultBlob && file) {
    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="font-medium">Your PDF is ready</p>
          <p className="mt-1 text-sm text-muted-foreground">{items.length} pages</p>
        </div>
        <ResultActions
          downloadLabel="Download PDF"
          onDownload={() => downloadBlob(resultBlob, `${stripExtension(file.name)}-organized.pdf`)}
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
        {isLoading && <ProcessingProgress label="Loading pages…" />}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ErrorBanner messages={errors} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item, index) => (
          <div key={item.id} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex aspect-[3/4] items-center justify-center overflow-hidden bg-muted/20 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.dataUrl}
                alt={`Page ${item.originalIndex + 1}`}
                className="max-h-full max-w-full object-contain transition-transform"
                style={{ transform: `rotate(${item.rotationDelta}deg)` }}
              />
            </div>
            <div className="flex items-center justify-between gap-1 border-t border-border p-2">
              <span className="text-xs text-muted-foreground">#{index + 1}</span>
              <div className="flex gap-1">
                <Button type="button" size="icon-sm" variant="outline" aria-label="Move up" disabled={index === 0} onClick={() => move(index, -1)}>
                  <ArrowUp className="size-3" aria-hidden="true" />
                </Button>
                <Button type="button" size="icon-sm" variant="outline" aria-label="Move down" disabled={index === items.length - 1} onClick={() => move(index, 1)}>
                  <ArrowDown className="size-3" aria-hidden="true" />
                </Button>
                <Button type="button" size="icon-sm" variant="outline" aria-label="Rotate" onClick={() => rotate(item.id)}>
                  <RotateCw className="size-3" aria-hidden="true" />
                </Button>
                <Button type="button" size="icon-sm" variant="outline" aria-label="Remove" onClick={() => remove(item.id)}>
                  <X className="size-3" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isProcessing && <ProcessingProgress label="Building your PDF…" />}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={exportPdf} disabled={isProcessing || items.length === 0}>
          {isProcessing ? "Exporting…" : "Export PDF"}
        </Button>
        <Button type="button" variant="outline" onClick={reset}>
          Choose a different PDF
        </Button>
      </div>
    </div>
  );
}
