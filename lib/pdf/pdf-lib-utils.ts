import type { PDFDocument } from "pdf-lib";

export async function loadPdfLibDoc(file: File | Blob | ArrayBuffer): Promise<PDFDocument> {
  const { PDFDocument } = await import("pdf-lib");
  const bytes = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
  try {
    return await PDFDocument.load(bytes);
  } catch {
    throw new Error(
      "This PDF couldn't be opened. It may be corrupted, password-protected, or not a valid PDF."
    );
  }
}

/** Merges multiple PDFs in the given order into one document. */
export async function mergePdfFiles(files: File[]): Promise<Uint8Array> {
  if (files.length < 2) {
    throw new Error("Add at least two PDF files to merge.");
  }
  const { PDFDocument } = await import("pdf-lib");
  const merged = await PDFDocument.create();
  for (const file of files) {
    const source = await loadPdfLibDoc(file);
    const pages = await merged.copyPages(source, source.getPageIndices());
    for (const page of pages) merged.addPage(page);
  }
  return merged.save();
}

/** Extracts the given 1-based page numbers (in that order) into a new PDF. */
export async function extractPdfPages(file: File, pageNumbers: number[]): Promise<Uint8Array> {
  const { PDFDocument } = await import("pdf-lib");
  const source = await loadPdfLibDoc(file);
  const result = await PDFDocument.create();
  const indices = pageNumbers.map((n) => n - 1);
  const pages = await result.copyPages(source, indices);
  for (const page of pages) result.addPage(page);
  return result.save();
}

export interface PageOperation {
  /** 0-based index into the ORIGINAL document. */
  originalIndex: number;
  /** Additional rotation to apply, in degrees (0/90/180/270), on top of the page's existing rotation. */
  rotationDelta: number;
}

/** Rebuilds a PDF from a reordered/rotated/filtered list of its original pages. */
export async function organizePdfPages(file: File, operations: PageOperation[]): Promise<Uint8Array> {
  if (operations.length === 0) {
    throw new Error("Keep at least one page.");
  }
  const { PDFDocument, degrees } = await import("pdf-lib");
  const source = await loadPdfLibDoc(file);
  const result = await PDFDocument.create();
  const pages = await result.copyPages(
    source,
    operations.map((op) => op.originalIndex)
  );
  pages.forEach((page, i) => {
    const op = operations[i];
    if (op.rotationDelta % 360 !== 0) {
      const current = page.getRotation().angle;
      page.setRotation(degrees((current + op.rotationDelta) % 360));
    }
    result.addPage(page);
  });
  return result.save();
}
