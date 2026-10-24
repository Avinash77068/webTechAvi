import { PDFDocument, degrees, rgb, StandardFonts } from "pdf-lib";

async function loadPdfLibDoc(file: File | Blob | ArrayBuffer): Promise<PDFDocument> {
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

export type OverlayItem =
  | {
      type: "text";
      /** 0-based page index. */
      pageIndex: number;
      /** Position as a fraction (0-1) of page width/height, measured from the top-left. */
      xFrac: number;
      yFrac: number;
      text: string;
      fontSize: number;
      color: { r: number; g: number; b: number };
    }
  | {
      type: "image";
      pageIndex: number;
      xFrac: number;
      yFrac: number;
      widthFrac: number;
      /** PNG bytes (e.g. a drawn signature or uploaded stamp). */
      pngBytes: ArrayBuffer;
    };

/** Draws text/signature overlays on top of a PDF's existing pages (does not alter embedded text). */
export async function addOverlaysToPdf(file: File, overlays: OverlayItem[]): Promise<Uint8Array> {
  const doc = await loadPdfLibDoc(file);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();

  for (const overlay of overlays) {
    const page = pages[overlay.pageIndex];
    if (!page) continue;
    const { width, height } = page.getSize();

    if (overlay.type === "text") {
      page.drawText(overlay.text, {
        x: overlay.xFrac * width,
        y: height - overlay.yFrac * height - overlay.fontSize,
        size: overlay.fontSize,
        font,
        color: rgb(overlay.color.r, overlay.color.g, overlay.color.b),
      });
    } else {
      const embedded = await doc.embedPng(overlay.pngBytes);
      const drawWidth = overlay.widthFrac * width;
      const scale = drawWidth / embedded.width;
      const drawHeight = embedded.height * scale;
      page.drawImage(embedded, {
        x: overlay.xFrac * width,
        y: height - overlay.yFrac * height - drawHeight,
        width: drawWidth,
        height: drawHeight,
      });
    }
  }

  return doc.save();
}
