export interface PdfPageTextResult {
  text: string;
  isLikelyEmpty: boolean;
}

async function getPdfjs() {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
  return pdfjsLib;
}

export type PdfDocumentHandle = Awaited<ReturnType<typeof loadPdfDocument>>;

/** Loads a PDF file into a pdf.js document, lazily loading the library on first use. */
export async function loadPdfDocument(file: File | Blob | ArrayBuffer) {
  const pdfjsLib = await getPdfjs();
  const data = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
  try {
    const task = pdfjsLib.getDocument({ data });
    return await task.promise;
  } catch {
    throw new Error(
      "This PDF couldn't be opened. It may be corrupted, password-protected, or not a valid PDF."
    );
  }
}

export async function renderPdfPageToCanvas(
  doc: Awaited<ReturnType<typeof loadPdfDocument>>,
  pageNumber: number,
  scale: number
): Promise<HTMLCanvasElement> {
  const page = await doc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not supported in this browser.");
  await page.render({ canvas, canvasContext: context, viewport }).promise;
  return canvas;
}

/** Renders a page scaled to fit `maxWidth` and returns a data URL, handy for thumbnails. */
export async function renderPdfPageThumbnail(
  doc: Awaited<ReturnType<typeof loadPdfDocument>>,
  pageNumber: number,
  maxWidth: number
): Promise<{ dataUrl: string; width: number; height: number; rotation: number }> {
  const page = await doc.getPage(pageNumber);
  const unscaled = page.getViewport({ scale: 1 });
  const scale = maxWidth / unscaled.width;
  const canvas = await renderPdfPageToCanvas(doc, pageNumber, scale);
  return {
    dataUrl: canvas.toDataURL("image/jpeg", 0.75),
    width: unscaled.width,
    height: unscaled.height,
    rotation: page.rotate,
  };
}

export async function extractPdfPageText(
  doc: Awaited<ReturnType<typeof loadPdfDocument>>,
  pageNumber: number
): Promise<PdfPageTextResult> {
  const page = await doc.getPage(pageNumber);
  const content = await page.getTextContent();
  let text = "";
  for (const item of content.items) {
    if ("str" in item) {
      text += item.str;
      if (item.hasEOL) text += "\n";
    }
  }
  const trimmed = text.trim();
  return { text, isLikelyEmpty: trimmed.length < 3 };
}

/** Parses a page-range string like "1-3, 5, 7-9" into a sorted, deduped list of 1-based page numbers. */
export function parsePageRanges(input: string, totalPages: number): number[] {
  const pages = new Set<number>();
  const parts = input
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    throw new Error("Enter at least one page or page range, e.g. 1-3, 5.");
  }

  for (const part of parts) {
    const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/);
    const singleMatch = part.match(/^(\d+)$/);

    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      if (start < 1 || end > totalPages || start > end) {
        throw new Error(`"${part}" is not a valid range for a ${totalPages}-page PDF.`);
      }
      for (let i = start; i <= end; i++) pages.add(i);
    } else if (singleMatch) {
      const page = Number(singleMatch[1]);
      if (page < 1 || page > totalPages) {
        throw new Error(`Page ${page} doesn't exist in this ${totalPages}-page PDF.`);
      }
      pages.add(page);
    } else {
      throw new Error(`"${part}" isn't a valid page or range.`);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}
