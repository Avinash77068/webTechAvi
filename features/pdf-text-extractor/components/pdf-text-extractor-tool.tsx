"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { sniffIsPdf, stripExtension } from "@/lib/validation";
import { downloadBlob, copyTextToClipboard } from "@/lib/download";
import {
  loadPdfDocument,
  renderPdfPageThumbnail,
  renderPdfPageToCanvas,
  extractPdfPageText,
  type PdfDocumentHandle,
} from "@/lib/pdf/pdfjs-client";
import { canvasToBlob } from "@/lib/image/canvas-utils";
import { ocrLanguages, recognizeImageText, type OcrLanguage } from "@/lib/ocr/tesseract-client";
import { getToolBySlug } from "@/lib/tools-registry";
import { toast } from "sonner";

const tool = getToolBySlug("pdf-text-extractor")!;

interface PageResult {
  pageNumber: number;
  method: "embedded" | "ocr";
  text: string;
}

export function PdfTextExtractorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [doc, setDoc] = useState<PdfDocumentHandle | null>(null);
  const [pages, setPages] = useState<PageThumb[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [language, setLanguage] = useState<OcrLanguage>("eng");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressLabel, setProgressLabel] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [results, setResults] = useState<PageResult[] | null>(null);
  const [combinedText, setCombinedText] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      doc?.cleanup();
      abortRef.current?.abort();
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

  async function runExtraction() {
    if (!doc || selected.size === 0) {
      setErrors(["Select at least one page."]);
      return;
    }
    setErrors([]);
    setIsProcessing(true);
    const controller = new AbortController();
    abortRef.current = controller;
    const sortedPages = Array.from(selected).sort((a, b) => a - b);
    const pageResults: PageResult[] = [];

    try {
      for (const pageNumber of sortedPages) {
        if (controller.signal.aborted) throw new DOMException("Cancelled", "AbortError");
        setProgressLabel(`Reading page ${pageNumber} (${pageResults.length + 1} of ${sortedPages.length})…`);

        const embedded = await extractPdfPageText(doc, pageNumber);
        if (!embedded.isLikelyEmpty) {
          pageResults.push({ pageNumber, method: "embedded", text: embedded.text.trim() });
          continue;
        }

        setProgressLabel(`Running OCR on page ${pageNumber} (${pageResults.length + 1} of ${sortedPages.length})…`);
        const canvas = await renderPdfPageToCanvas(doc, pageNumber, 2);
        const blob = await canvasToBlob(canvas, "png", 1);
        const text = await recognizeImageText(blob, language, undefined, controller.signal);
        pageResults.push({ pageNumber, method: "ocr", text: text.trim() });
      }

      setResults(pageResults);
      setCombinedText(
        pageResults
          .map((r) => `--- Page ${r.pageNumber} (${r.method === "embedded" ? "embedded text" : "OCR"}) ---\n${r.text}`)
          .join("\n\n")
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        toast.info("Extraction cancelled.");
      } else {
        setErrors([error instanceof Error ? error.message : "Failed to extract text from this PDF."]);
      }
    } finally {
      setIsProcessing(false);
      setProgressLabel("");
      abortRef.current = null;
    }
  }

  function cancel() {
    abortRef.current?.abort();
  }

  function reset() {
    setFile(null);
    setDoc(null);
    setPages([]);
    setSelected(new Set());
    setResults(null);
    setCombinedText("");
    setErrors([]);
  }

  async function handleCopy() {
    const ok = await copyTextToClipboard(combinedText);
    if (ok) toast.success("Copied to clipboard.");
    else toast.error("Couldn't copy — select and copy manually.");
  }

  function handleDownload() {
    const blob = new Blob([combinedText], { type: "text/plain;charset=utf-8" });
    downloadBlob(blob, `${file ? stripExtension(file.name) : "extracted"}-text.txt`);
  }

  if (results) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {results.map((r) => (
            <Badge key={r.pageNumber} variant={r.method === "ocr" ? "default" : "secondary"}>
              Page {r.pageNumber}: {r.method === "ocr" ? "OCR" : "embedded"}
            </Badge>
          ))}
        </div>
        <Label htmlFor="extracted-text">Extracted text (editable)</Label>
        <Textarea
          id="extracted-text"
          value={combinedText}
          onChange={(e) => setCombinedText(e.target.value)}
          rows={14}
          className="font-mono text-sm"
        />
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={handleDownload}>
            <Download aria-hidden="true" />
            Download TXT
          </Button>
          <Button type="button" variant="outline" onClick={handleCopy}>
            <Copy aria-hidden="true" />
            Copy text
          </Button>
          <Button type="button" variant="outline" onClick={reset}>
            <RotateCcw aria-hidden="true" />
            Start over
          </Button>
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
        <div className="flex items-center gap-2">
          <Label htmlFor="ocr-fallback-language" className="shrink-0 text-sm">
            OCR language
          </Label>
          <Select value={language} onValueChange={(v) => setLanguage(v as OcrLanguage)}>
            <SelectTrigger id="ocr-fallback-language" className="w-32" disabled={isProcessing}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ocrLanguages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Used only for pages that don't have selectable embedded text.
      </p>

      <ErrorBanner messages={errors} />

      <SelectablePageGrid pages={pages} selected={selected} onToggle={toggle} />

      {isProcessing && <ProcessingProgress label={progressLabel || "Processing…"} />}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={runExtraction} disabled={isProcessing || selected.size === 0}>
          {isProcessing ? "Extracting…" : `Extract text from ${selected.size} page${selected.size === 1 ? "" : "s"}`}
        </Button>
        {isProcessing && (
          <Button type="button" variant="outline" onClick={cancel}>
            Cancel
          </Button>
        )}
        {!isProcessing && (
          <Button type="button" variant="outline" onClick={reset}>
            Choose a different PDF
          </Button>
        )}
      </div>
    </div>
  );
}
