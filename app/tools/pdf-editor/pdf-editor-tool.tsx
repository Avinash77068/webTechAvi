"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, PenTool, Trash2, Type, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ErrorBanner } from "@/components/tools/error-banner";
import { ProcessingProgress } from "@/components/tools/processing-progress";
import { ResultActions } from "@/components/tools/result-actions";
import { SignaturePad } from "@/components/tools/pdf/signature-pad";
import { sniffIsPdf, stripExtension } from "@/lib/validation";
import { downloadBlob } from "@/lib/download";
import { loadPdfDocument, renderPdfPageToCanvas, type PdfDocumentHandle } from "@/lib/pdf/pdfjs-client";
import { addOverlaysToPdf, type OverlayItem } from "@/lib/pdf/pdf-lib-utils";
import { cn } from "@/lib/utils";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("pdf-editor")!;
const PREVIEW_WIDTH_PT_TARGET = 700;

interface EditorOverlay {
  id: string;
  type: "text" | "signature";
  pageIndex: number;
  xFrac: number;
  yFrac: number;
  text?: string;
  fontSize?: number;
  widthFrac?: number;
  pngUrl?: string;
  pngBytes?: ArrayBuffer;
}

export function PdfEditorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [doc, setDoc] = useState<PdfDocumentHandle | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageImageUrl, setPageImageUrl] = useState<string | null>(null);
  const [pageSizePt, setPageSizePt] = useState({ width: 0, height: 0 });
  const [displayScale, setDisplayScale] = useState(1);
  const [mode, setMode] = useState<"idle" | "text" | "signature">("idle");
  const [overlays, setOverlays] = useState<EditorOverlay[]>([]);
  const [signatureBlob, setSignatureBlob] = useState<{ url: string; bytes: ArrayBuffer } | null>(null);
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [pendingSignaturePlacement, setPendingSignaturePlacement] = useState<{ xFrac: number; yFrac: number } | null>(null);
  const [textDialog, setTextDialog] = useState<{ xFrac: number; yFrac: number } | null>(null);
  const [textValue, setTextValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      doc?.cleanup();
      if (pageImageUrl) URL.revokeObjectURL(pageImageUrl);
      if (signatureBlob) URL.revokeObjectURL(signatureBlob.url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc]);

  // Track the displayed preview size so overlay positions/font sizes stay accurate when it's resized.
  useEffect(() => {
    const el = imgWrapperRef.current;
    if (!el || pageSizePt.height === 0) return;
    const observer = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      if (rect.height > 0) setDisplayScale(rect.height / pageSizePt.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [pageSizePt]);

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
      setPageCount(pdfDoc.numPages);
      setCurrentPage(1);
      setOverlays([]);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Couldn't open this PDF."]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!doc) return;
    let cancelled = false;
    (async () => {
      const page = await doc.getPage(currentPage);
      const unscaled = page.getViewport({ scale: 1 });
      const scale = PREVIEW_WIDTH_PT_TARGET / unscaled.width;
      const canvas = await renderPdfPageToCanvas(doc, currentPage, scale);
      if (cancelled) return;
      canvas.toBlob((blob) => {
        if (!blob || cancelled) return;
        setPageImageUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
      }, "image/jpeg", 0.9);
      setPageSizePt({ width: unscaled.width, height: unscaled.height });
    })();
    return () => {
      cancelled = true;
    };
  }, [doc, currentPage]);

  function handlePageClick(e: React.MouseEvent<HTMLDivElement>) {
    if (mode === "idle") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xFrac = (e.clientX - rect.left) / rect.width;
    const yFrac = (e.clientY - rect.top) / rect.height;

    if (mode === "text") {
      setTextDialog({ xFrac, yFrac });
      setTextValue("");
    } else if (mode === "signature") {
      if (!signatureBlob) {
        setPendingSignaturePlacement({ xFrac, yFrac });
        setSignatureDialogOpen(true);
        return;
      }
      placeSignature(xFrac, yFrac, signatureBlob);
    }
  }

  function placeSignature(xFrac: number, yFrac: number, blob: { url: string; bytes: ArrayBuffer }) {
    setOverlays((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "signature",
        pageIndex: currentPage - 1,
        xFrac,
        yFrac,
        widthFrac: 0.25,
        pngUrl: blob.url,
        pngBytes: blob.bytes,
      },
    ]);
  }

  function confirmTextOverlay() {
    if (!textDialog || !textValue.trim()) {
      setTextDialog(null);
      return;
    }
    setOverlays((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "text",
        pageIndex: currentPage - 1,
        xFrac: textDialog.xFrac,
        yFrac: textDialog.yFrac,
        text: textValue,
        fontSize: 16,
      },
    ]);
    setTextDialog(null);
    setTextValue("");
  }

  async function handleSignatureSave(blob: Blob) {
    const bytes = await blob.arrayBuffer();
    const url = URL.createObjectURL(blob);
    setSignatureBlob((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return { url, bytes };
    });
    setSignatureDialogOpen(false);
    if (pendingSignaturePlacement) {
      placeSignature(pendingSignaturePlacement.xFrac, pendingSignaturePlacement.yFrac, { url, bytes });
      setPendingSignaturePlacement(null);
    }
  }

  function undoLast() {
    setOverlays((prev) => prev.slice(0, -1));
  }

  function removeOverlay(id: string) {
    setOverlays((prev) => prev.filter((o) => o.id !== id));
  }

  async function exportPdf() {
    if (!file) return;
    if (overlays.length === 0) {
      setErrors(["Add at least one text box or signature before exporting."]);
      return;
    }
    setErrors([]);
    setIsProcessing(true);
    try {
      const items: OverlayItem[] = overlays.map((o) =>
        o.type === "text"
          ? {
              type: "text",
              pageIndex: o.pageIndex,
              xFrac: o.xFrac,
              yFrac: o.yFrac,
              text: o.text ?? "",
              fontSize: o.fontSize ?? 16,
              color: { r: 0.07, g: 0.09, b: 0.15 },
            }
          : {
              type: "image",
              pageIndex: o.pageIndex,
              xFrac: o.xFrac,
              yFrac: o.yFrac,
              widthFrac: o.widthFrac ?? 0.25,
              pngBytes: o.pngBytes as ArrayBuffer,
            }
      );
      const bytes = await addOverlaysToPdf(file, items);
      setResultBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }));
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Failed to export this PDF."]);
    } finally {
      setIsProcessing(false);
    }
  }

  function reset() {
    setFile(null);
    setDoc(null);
    setOverlays([]);
    setResultBlob(null);
    setErrors([]);
    setMode("idle");
  }

  const currentPageOverlays = overlays
    .map((o, i) => ({ ...o, order: i }))
    .filter((o) => o.pageIndex === currentPage - 1);

  if (resultBlob && file) {
    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="font-medium">Your PDF is ready</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {overlays.length} overlay{overlays.length === 1 ? "" : "s"} added across {pageCount} pages
          </p>
        </div>
        <ResultActions
          downloadLabel="Download PDF"
          onDownload={() => downloadBlob(resultBlob, `${stripExtension(file.name)}-edited.pdf`)}
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="sm"
            variant={mode === "text" ? "default" : "outline"}
            onClick={() => setMode(mode === "text" ? "idle" : "text")}
          >
            <Type className="size-4" aria-hidden="true" />
            Add text
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === "signature" ? "default" : "outline"}
            onClick={() => setMode(mode === "signature" ? "idle" : "signature")}
          >
            <PenTool className="size-4" aria-hidden="true" />
            Signature
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={undoLast} disabled={overlays.length === 0}>
            <Undo2 className="size-4" aria-hidden="true" />
            Undo last
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            aria-label="Previous page"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {pageCount}
          </span>
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            aria-label="Next page"
            disabled={currentPage >= pageCount}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {mode !== "idle" && (
        <p className="text-xs text-muted-foreground">
          {mode === "text" ? "Click on the page to place a text box." : "Click on the page to place your signature."}
        </p>
      )}

      <ErrorBanner messages={errors} />

      <div className="flex justify-center rounded-xl border border-border bg-muted/30 p-4">
        <div
          ref={imgWrapperRef}
          onClick={handlePageClick}
          className={cn("relative inline-block", mode !== "idle" && "cursor-crosshair")}
        >
          {pageImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pageImageUrl} alt={`Page ${currentPage}`} className="max-h-[600px] w-auto select-none" draggable={false} />
          )}
          {currentPageOverlays.map((overlay) =>
            overlay.type === "text" ? (
              <span
                key={overlay.id}
                style={{
                  position: "absolute",
                  left: `${(overlay.xFrac * 100).toString()}%`,
                  top: `${(overlay.yFrac * 100).toString()}%`,
                  fontSize: (overlay.fontSize ?? 16) * displayScale,
                  color: "#121826",
                  whiteSpace: "pre",
                }}
              >
                {overlay.text}
              </span>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={overlay.id}
                src={overlay.pngUrl}
                alt="Signature"
                style={{
                  position: "absolute",
                  left: `${(overlay.xFrac * 100).toString()}%`,
                  top: `${(overlay.yFrac * 100).toString()}%`,
                  width: `${((overlay.widthFrac ?? 0.25) * 100).toString()}%`,
                }}
              />
            )
          )}
        </div>
      </div>

      {overlays.length > 0 && (
        <ul className="space-y-1.5">
          {overlays.map((overlay, i) => (
            <li key={overlay.id} className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm">
              <span className="truncate text-muted-foreground">
                Page {overlay.pageIndex + 1} — {overlay.type === "text" ? `"${overlay.text}"` : "Signature"}
              </span>
              <Button type="button" size="icon-sm" variant="ghost" aria-label={`Remove overlay ${i + 1}`} onClick={() => removeOverlay(overlay.id)}>
                <Trash2 className="size-3.5" aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {isProcessing && <ProcessingProgress label="Exporting PDF…" />}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={exportPdf} disabled={isProcessing || overlays.length === 0}>
          {isProcessing ? "Exporting…" : "Export PDF"}
        </Button>
        <Button type="button" variant="outline" onClick={reset}>
          Choose a different PDF
        </Button>
      </div>

      <Dialog open={!!textDialog} onOpenChange={(open) => !open && setTextDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add text</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder="Type text to place on the page"
            onKeyDown={(e) => {
              if (e.key === "Enter") confirmTextOverlay();
            }}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setTextDialog(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={confirmTextOverlay}>
              Place text
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={signatureDialogOpen} onOpenChange={setSignatureDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Draw your signature</DialogTitle>
          </DialogHeader>
          <SignaturePad
            onSave={handleSignatureSave}
            onCancel={() => {
              setSignatureDialogOpen(false);
              setPendingSignaturePlacement(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
