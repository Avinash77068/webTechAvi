import { PDFDocument, PageSizes } from "pdf-lib";
import { sniffImageType } from "@/lib/validation";
import { canvasToBlob, drawBitmapToCanvas, loadImageBitmap } from "@/lib/image/canvas-utils";

export type PdfPageSize = "a4" | "letter" | "fit";
export type PdfOrientation = "portrait" | "landscape";

export interface NormalizedImageInput {
  bytes: ArrayBuffer;
  kind: "jpeg" | "png";
  width: number;
  height: number;
}

export interface ImageToPdfOptions {
  pageSize: PdfPageSize;
  orientation: PdfOrientation;
  marginPt?: number;
}

const PAGE_MARGIN_DEFAULT = 24;

/**
 * pdf-lib can only embed JPEG and PNG. JPEG/PNG inputs pass through untouched to avoid
 * re-encoding loss; anything else (e.g. WebP) is re-encoded to PNG via canvas.
 */
export async function normalizeImageForPdf(file: File): Promise<NormalizedImageInput> {
  const sniffed = await sniffImageType(file);
  const bitmap = await loadImageBitmap(file);

  if (sniffed === "jpeg" || sniffed === "png") {
    return {
      bytes: await file.arrayBuffer(),
      kind: sniffed,
      width: bitmap.width,
      height: bitmap.height,
    };
  }

  const canvas = drawBitmapToCanvas(bitmap, bitmap.width, bitmap.height);
  const blob = await canvasToBlob(canvas, "png", 1);
  return {
    bytes: await blob.arrayBuffer(),
    kind: "png",
    width: bitmap.width,
    height: bitmap.height,
  };
}

function getFixedPageDimensions(
  pageSize: Exclude<PdfPageSize, "fit">,
  orientation: PdfOrientation
): [number, number] {
  const base = pageSize === "a4" ? PageSizes.A4 : PageSizes.Letter;
  const [w, h] = base;
  return orientation === "landscape" ? [h, w] : [w, h];
}

/** Builds a downloadable PDF from already-decoded images, one per page. */
export async function buildPdfFromImages(
  images: NormalizedImageInput[],
  options: ImageToPdfOptions
): Promise<Uint8Array> {
  if (images.length === 0) {
    throw new Error("Add at least one image before generating a PDF.");
  }

  const pdfDoc = await PDFDocument.create();
  const margin = options.marginPt ?? PAGE_MARGIN_DEFAULT;

  for (const image of images) {
    const embedded =
      image.kind === "jpeg"
        ? await pdfDoc.embedJpg(image.bytes)
        : await pdfDoc.embedPng(image.bytes);

    let pageWidth: number;
    let pageHeight: number;

    if (options.pageSize === "fit") {
      // Page matches the image's own pixel dimensions exactly; orientation doesn't apply.
      pageWidth = image.width;
      pageHeight = image.height;
    } else {
      [pageWidth, pageHeight] = getFixedPageDimensions(options.pageSize, options.orientation);
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    const availableWidth = options.pageSize === "fit" ? pageWidth : pageWidth - margin * 2;
    const availableHeight = options.pageSize === "fit" ? pageHeight : pageHeight - margin * 2;

    const scale = Math.min(availableWidth / image.width, availableHeight / image.height);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;

    page.drawImage(embedded, {
      x: (pageWidth - drawWidth) / 2,
      y: (pageHeight - drawHeight) / 2,
      width: drawWidth,
      height: drawHeight,
    });
  }

  return pdfDoc.save();
}
