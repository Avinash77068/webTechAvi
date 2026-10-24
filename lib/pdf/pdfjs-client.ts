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


/** A horizontal run of existing text on a page, in PDF points from the top-left of the page as displayed. */
export interface PdfTextRun {
  text: string;
  x: number;
  /** Baseline position. */
  baseline: number;
  width: number;
  /** Font size. */
  fontSize: number;
}

/** Finds the text already on a page and joins neighbouring pieces on the same line into one run. */
export async function getPdfPageTextRuns(
  doc: Awaited<ReturnType<typeof loadPdfDocument>>,
  pageNumber: number
): Promise<PdfTextRun[]> {
  const page = await doc.getPage(pageNumber);
  const [a1, b1, c1, d1, e1, f1] = page.getViewport({ scale: 1 }).transform;
  const content = await page.getTextContent();
  const pieces: PdfTextRun[] = [];

  for (const item of content.items) {
    if (!("str" in item) || item.str.trim() === "") continue;
    const [a2, b2, c2, d2, e2, f2] = item.transform;
    const matrix = [
      a1 * a2 + c1 * b2,
      b1 * a2 + d1 * b2,
      a1 * c2 + c1 * d2,
      b1 * c2 + d1 * d2,
      a1 * e2 + c1 * f2 + e1,
      b1 * e2 + d1 * f2 + f1,
    ];
    // Skip rotated or vertical text.
    if (Math.abs(matrix[1]) > 0.01 || Math.abs(matrix[2]) > 0.01) continue;
    pieces.push({
      text: item.str,
      x: matrix[4],
      baseline: matrix[5],
      width: item.width,
      fontSize: Math.hypot(matrix[2], matrix[3]),
    });
  }

  pieces.sort((p, q) => (Math.abs(p.baseline - q.baseline) < 1 ? p.x - q.x : p.baseline - q.baseline));

  const runs: PdfTextRun[] = [];
  for (const piece of pieces) {
    const last = runs[runs.length - 1];
    const gap = last ? piece.x - (last.x + last.width) : 0;
    if (last && Math.abs(last.baseline - piece.baseline) < 1 && gap < last.fontSize * 0.5) {
      const needsSpace = gap > last.fontSize * 0.15 && !last.text.endsWith(" ") && !piece.text.startsWith(" ");
      last.text += (needsSpace ? " " : "") + piece.text;
      last.width = piece.x + piece.width - last.x;
      last.fontSize = Math.max(last.fontSize, piece.fontSize);
    } else {
      runs.push({ ...piece });
    }
  }
  return runs;
}
