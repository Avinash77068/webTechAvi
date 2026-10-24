"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Download, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { downloadBlob, copyTextToClipboard } from "@/lib/download";
import { stripExtension } from "@/lib/validation";
import { ocrLanguages, recognizeImageText, type OcrLanguage, type OcrProgress } from "@/lib/ocr/tesseract-client";
import { getToolBySlug } from "@/lib/tools-registry";
import { toast } from "sonner";
import { STATUS_LABELS } from "../constants";

const tool = getToolBySlug("image-to-text")!;

export function ImageToTextTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [language, setLanguage] = useState<OcrLanguage>("eng");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<OcrProgress | null>(null);
  const [text, setText] = useState("");
  const [hasResult, setHasResult] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      abortRef.current?.abort();
    };
  }, [previewUrl]);

  function handleFilesAccepted(files: File[]) {
    const picked = files[0];
    if (!picked) return;
    setErrors([]);
    setText("");
    setHasResult(false);
    setFile(picked);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(picked);
    });
  }

  async function runOcr() {
    if (!file) return;
    setErrors([]);
    setIsProcessing(true);
    setProgress({ status: "Starting…", progress: 0 });
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const extracted = await recognizeImageText(
        file,
        language,
        (p) => setProgress(p),
        controller.signal
      );
      setText(extracted);
      setHasResult(true);
      if (!extracted.trim()) {
        toast.info("No text was detected in this image.");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        toast.info("OCR cancelled.");
      } else {
        setErrors([
          error instanceof Error
            ? error.message
            : "OCR failed. Try a clearer, higher-resolution image.",
        ]);
      }
    } finally {
      setIsProcessing(false);
      setProgress(null);
      abortRef.current = null;
    }
  }

  function cancelOcr() {
    abortRef.current?.abort();
  }

  function reset() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setText("");
    setHasResult(false);
    setErrors([]);
  }

  async function handleCopy() {
    const ok = await copyTextToClipboard(text);
    if (ok) toast.success("Copied to clipboard.");
    else toast.error("Couldn't copy — select and copy manually.");
  }

  function handleDownload() {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    downloadBlob(blob, `${file ? stripExtension(file.name) : "extracted"}-text.txt`);
  }

  return (
    <div className="space-y-5">
      {!file && (
        <FileDropzone
          accept="image/jpeg,image/png,image/webp,image/bmp"
          acceptedMimeTypes={["image/jpeg", "image/png", "image/webp", "image/bmp"]}
          acceptedFormatsLabel={tool.acceptedFormats.join(", ")}
          maxSizeMB={tool.maxFileSizeMB}
          onFilesAccepted={handleFilesAccepted}
          onFilesRejected={setErrors}
        />
      )}

      <ErrorBanner messages={errors} />

      {file && previewUrl && (
        <div className="grid gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-[160px_1fr]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="" className="h-36 w-full rounded-lg border border-border bg-muted/30 object-contain" />
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <Button type="button" size="icon" variant="ghost" aria-label="Remove image" onClick={reset}>
                <X className="size-4" aria-hidden="true" />
              </Button>
            </div>
            <div className="max-w-xs">
              <Label htmlFor="ocr-language">Language</Label>
              <Select value={language} onValueChange={(value) => setLanguage(value as OcrLanguage)}>
                <SelectTrigger id="ocr-language" className="mt-2 w-full" disabled={isProcessing}>
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
            <div className="flex gap-2">
              <Button type="button" onClick={runOcr} disabled={isProcessing}>
                {isProcessing ? "Extracting…" : "Extract text"}
              </Button>
              {isProcessing && (
                <Button type="button" variant="outline" onClick={cancelOcr}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {isProcessing && progress && (
        <ProcessingProgress
          label={STATUS_LABELS[progress.status] ?? "Processing…"}
          progress={progress.progress * 100}
        />
      )}

      {hasResult && (
        <div className="space-y-3">
          <Label htmlFor="ocr-result">Extracted text (editable)</Label>
          <Textarea
            id="ocr-result"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
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
      )}
    </div>
  );
}
