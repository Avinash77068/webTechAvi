"use client";

import { useState } from "react";
import { docxFileToBlocks } from "@/lib/docx/docx-import";
import { blocksToPdf } from "@/lib/pdf/blocks-to-pdf";
import { stripExtension } from "@/lib/validation";

export function useWordToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  async function convert() {
    if (!file) return;
    setErrors([]);
    setWarnings([]);
    setIsProcessing(true);
    try {
      const blocks = await docxFileToBlocks(file);
      if (blocks.length === 0) throw new Error("This document has no text to convert.");
      const { bytes, hadUnsupportedText } = await blocksToPdf(blocks);
      setResultBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }));
      if (hadUnsupportedText) {
        setWarnings(["Some characters (for example non-Latin scripts) can't be shown in the PDF and were replaced with \"?\"."]);
      }
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Failed to convert this document."]);
    } finally {
      setIsProcessing(false);
    }
  }

  function reset() {
    setFile(null);
    setResultBlob(null);
    setErrors([]);
    setWarnings([]);
  }

  return {
    file,
    selectFile: setFile,
    isProcessing,
    errors,
    setErrors,
    warnings,
    resultBlob,
    convert,
    reset,
    outputName: file ? `${stripExtension(file.name)}.pdf` : "document.pdf",
  };
}
