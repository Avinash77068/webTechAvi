"use client";

import { useEffect, useState } from "react";
import { sniffIsPdf } from "@/lib/validation";
import {
  getPdfPageTextRuns,
  loadPdfDocument,
  renderPdfPageToCanvas,
  type PdfDocumentHandle,
  type PdfTextRun,
} from "@/lib/pdf/pdfjs-client";
import { PREVIEW_RENDER_WIDTH } from "../constants";
import type { PageSize } from "../types";

/** Loads a PDF with PDF.js and renders the current page as an image for the editor canvas. */
export function usePdfPages() {
  const [file, setFile] = useState<File | null>(null);
  const [doc, setDoc] = useState<PdfDocumentHandle | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageImageUrl, setPageImageUrl] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<PageSize | null>(null);
  const [textRuns, setTextRuns] = useState<PdfTextRun[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      doc?.cleanup();
    };
  }, [doc]);

  useEffect(() => {
    if (!doc) return;
    let cancelled = false;
    let createdUrl: string | null = null;
    (async () => {
      try {
        const page = await doc.getPage(currentPage);
        const unscaled = page.getViewport({ scale: 1 });
        const canvas = await renderPdfPageToCanvas(doc, currentPage, PREVIEW_RENDER_WIDTH / unscaled.width);
        if (cancelled) return;
        const runs = await getPdfPageTextRuns(doc, currentPage).catch(() => []);
        if (cancelled) return;
        canvas.toBlob(
          (blob) => {
            if (!blob || cancelled) return;
            createdUrl = URL.createObjectURL(blob);
            setPageImageUrl(createdUrl);
            setPageSize({ width: unscaled.width, height: unscaled.height });
            setTextRuns(runs);
          },
          "image/jpeg",
          0.92,
        );
      } catch {
        if (!cancelled) setErrors(["Couldn't display this page."]);
      }
    })();
    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [doc, currentPage]);

  async function open(picked: File) {
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
      setCurrentPage(1);
      setPageImageUrl(null);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Couldn't open this PDF."]);
    } finally {
      setIsLoading(false);
    }
  }

  function close() {
    setFile(null);
    setDoc(null);
    setPageImageUrl(null);
    setPageSize(null);
    setTextRuns([]);
    setErrors([]);
  }

  const pageCount = doc?.numPages ?? 0;

  return {
    file,
    pageCount,
    currentPage,
    goToPage: (page: number) => setCurrentPage(Math.min(Math.max(1, page), Math.max(1, pageCount))),
    pageImageUrl,
    pageSize,
    textRuns,
    isLoading,
    errors,
    setErrors,
    open,
    close,
  };
}
