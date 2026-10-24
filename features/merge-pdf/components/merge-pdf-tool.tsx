"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, FileText, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ErrorBanner } from "@/components/tools/error-banner";
import { ProcessingProgress } from "@/components/tools/processing-progress";
import { ResultActions } from "@/components/tools/result-actions";
import { formatBytes, sniffIsPdf } from "@/lib/validation";
import { downloadBlob } from "@/lib/download";
import { mergePdfFiles } from "@/lib/pdf/pdf-lib-utils";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("merge-pdf")!;

interface PdfItem {
  id: string;
  file: File;
}

export function MergePdfTool() {
  const [items, setItems] = useState<PdfItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const itemsRef = useRef<PdfItem[]>([]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  async function handleFilesAccepted(files: File[]) {
    setErrors([]);
    const valid: PdfItem[] = [];
    const rejected: string[] = [];
    for (const file of files) {
      if (await sniffIsPdf(file)) {
        valid.push({ id: `${file.name}-${file.size}-${crypto.randomUUID()}`, file });
      } else {
        rejected.push(`"${file.name}" doesn't look like a valid PDF file.`);
      }
    }
    if (rejected.length) setErrors(rejected);
    setItems((prev) => [...prev, ...valid]);
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

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function merge() {
    if (items.length < 2) {
      setErrors(["Add at least two PDF files to merge."]);
      return;
    }
    setErrors([]);
    setIsProcessing(true);
    try {
      const bytes = await mergePdfFiles(items.map((i) => i.file));
      setResultBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }));
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Failed to merge these PDFs."]);
    } finally {
      setIsProcessing(false);
    }
  }

  function reset() {
    setItems([]);
    setResultBlob(null);
    setErrors([]);
  }

  if (resultBlob) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="size-6" aria-hidden="true" />
          </span>
          <div>
            <p className="font-medium">Your merged PDF is ready</p>
            <p className="text-sm text-muted-foreground">
              {items.length} files combined · {formatBytes(resultBlob.size)}
            </p>
          </div>
        </div>
        <ResultActions
          downloadLabel="Download merged PDF"
          onDownload={() => downloadBlob(resultBlob, "merged.pdf")}
          onReset={reset}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <FileDropzone
        accept="application/pdf"
        acceptedMimeTypes={["application/pdf"]}
        acceptedExtensions={[".pdf"]}
        acceptedFormatsLabel="PDF"
        maxSizeMB={tool.maxFileSizeMB}
        multiple
        onFilesAccepted={handleFilesAccepted}
        onFilesRejected={setErrors}
      />

      <ErrorBanner messages={errors} />

      {items.length > 0 && (
        <>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={item.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                <span className="w-6 shrink-0 text-center text-sm text-muted-foreground">{index + 1}</span>
                <FileText className="size-8 shrink-0 text-primary" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(item.file.size)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button type="button" size="icon-sm" variant="outline" aria-label="Move up" disabled={index === 0} onClick={() => move(index, -1)}>
                    <ArrowUp className="size-3.5" aria-hidden="true" />
                  </Button>
                  <Button type="button" size="icon-sm" variant="outline" aria-label="Move down" disabled={index === items.length - 1} onClick={() => move(index, 1)}>
                    <ArrowDown className="size-3.5" aria-hidden="true" />
                  </Button>
                  <Button type="button" size="icon-sm" variant="outline" aria-label="Remove" onClick={() => removeItem(item.id)}>
                    <X className="size-3.5" aria-hidden="true" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          {isProcessing && <ProcessingProgress label="Merging PDFs…" />}

          <Button type="button" onClick={merge} disabled={isProcessing || items.length < 2}>
            {isProcessing ? "Merging…" : `Merge ${items.length} PDFs`}
          </Button>
        </>
      )}

      {items.length === 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          <Plus className="size-4" aria-hidden="true" />
          Add two or more PDF files to merge.
        </div>
      )}
    </div>
  );
}
