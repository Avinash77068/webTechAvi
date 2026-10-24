"use client";

import { useState } from "react";
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
import { SelectablePageGrid, type PageThumb } from "@/components/tools/pdf/selectable-page-grid";
import { sniffIsPdf, stripExtension } from "@/lib/validation";
import { downloadBlob } from "@/lib/download";
import { loadPdfDocument, renderPdfPageThumbnail } from "@/lib/pdf/pdfjs-client";
import { extractPdfPages } from "@/lib/pdf/pdf-lib-utils";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("split-pdf")!;
type ExportMode = "single" | "separate";

export function SplitPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageThumb[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [exportMode, setExportMode] = useState<ExportMode>("single");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);

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
      const thumbs: PageThumb[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const { dataUrl } = await renderPdfPageThumbnail(doc, i, 220);
        thumbs.push({ pageNumber: i, dataUrl });
      }
      setFile(picked);
      setPages(thumbs);
      setSelected(new Set(Array.from({ length: doc.numPages }, (_, i) => i + 1)));
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

  async function runSplit() {
    if (!file || selected.size === 0) {
      setErrors(["Select at least one page."]);
      return;
    }
    setErrors([]);
    setIsProcessing(true);
    const sortedPages = Array.from(selected).sort((a, b) => a - b);
    try {
      if (exportMode === "single") {
        const bytes = await extractPdfPages(file, sortedPages);
        setResult({
          blob: new Blob([bytes as BlobPart], { type: "application/pdf" }),
          filename: `${stripExtension(file.name)}-pages.pdf`,
        });
      } else {
        const JSZip = (await import("jszip")).default;
        const zip = new JSZip();
        for (const pageNumber of sortedPages) {
          const bytes = await extractPdfPages(file, [pageNumber]);
          zip.file(`page-${pageNumber}.pdf`, bytes);
        }
        const zipBlob = await zip.generateAsync({ type: "blob" });
        setResult({ blob: zipBlob, filename: `${stripExtension(file.name)}-pages.zip` });
      }
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Failed to split this PDF."]);
    } finally {
      setIsProcessing(false);
    }
  }

  function reset() {
    setFile(null);
    setPages([]);
    setSelected(new Set());
    setResult(null);
    setErrors([]);
  }

  if (result) {
    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="font-medium">Your file is ready</p>
          <p className="mt-1 text-sm text-muted-foreground">{result.filename}</p>
        </div>
        <ResultActions onDownload={() => downloadBlob(result.blob, result.filename)} onReset={reset} />
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
        <div className="flex items-center gap-2">
          <Label htmlFor="export-mode" className="shrink-0 text-sm">
            Export as
          </Label>
          <Select value={exportMode} onValueChange={(v) => setExportMode(v as ExportMode)}>
            <SelectTrigger id="export-mode" className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">One PDF</SelectItem>
              <SelectItem value="separate">Separate files (ZIP)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ErrorBanner messages={errors} />

      <SelectablePageGrid pages={pages} selected={selected} onToggle={toggle} />

      {isProcessing && <ProcessingProgress label="Preparing your download…" />}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={runSplit} disabled={isProcessing || selected.size === 0}>
          {isProcessing ? "Processing…" : `Export ${selected.size} page${selected.size === 1 ? "" : "s"}`}
        </Button>
        <Button type="button" variant="outline" onClick={reset}>
          Choose a different PDF
        </Button>
      </div>
    </div>
  );
}
