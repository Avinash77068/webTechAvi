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


export async function normalizeImageForPdf(file: File, rotationDeg = 0): Promise<NormalizedImageInput> {
  const sniffed = await sniffImageType(file);
  const bitmap = await loadImageBitmap(file);
  const rotation = ((rotationDeg % 360) + 360) % 360;

  if (rotation !== 0) {
    const canvas = drawBitmapToCanvas(bitmap, bitmap.width, bitmap.height, rotation);
    const kind = sniffed === "jpeg" ? "jpeg" : "png";
    const blob = await canvasToBlob(canvas, kind, 0.92);
    return { bytes: await blob.arrayBuffer(), kind, width: canvas.width, height: canvas.height };
  }

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
  orientation: PdfOrientation,
  pageSizes: typeof import("pdf-lib").PageSizes
): [number, number] {
  const base = pageSize === "a4" ? pageSizes.A4 : pageSizes.Letter;
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

  const { PDFDocument, PageSizes } = await import("pdf-lib");
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
      [pageWidth, pageHeight] = getFixedPageDimensions(options.pageSize, options.orientation, PageSizes);
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
