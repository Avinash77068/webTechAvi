export type OutputImageFormat = "jpeg" | "png" | "webp";

const formatToMime: Record<OutputImageFormat, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export const formatToExtension: Record<OutputImageFormat, string> = {
  jpeg: "jpg",
  png: "png",
  webp: "webp",
};

/** Loads a File/Blob into a decoded ImageBitmap. Throws if the browser cannot decode it. */
export async function loadImageBitmap(file: File | Blob): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file);
  } catch {
    throw new Error(
      "This image could not be decoded by your browser. The file may be corrupted or in an unsupported format."
    );
  }
}

export function drawBitmapToCanvas(
  bitmap: ImageBitmap,
  width: number,
  height: number,
  rotationDeg = 0
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const rotated = rotationDeg % 180 !== 0;
  canvas.width = rotated ? height : width;
  canvas.height = rotated ? width : height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotationDeg * Math.PI) / 180);
  ctx.drawImage(bitmap, -width / 2, -height / 2, width, height);
  ctx.restore();

  return canvas;
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: OutputImageFormat,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to encode the image. Try a different format or quality."));
      },
      formatToMime[format],
      format === "png" ? undefined : quality
    );
  });
}

export interface Dimensions {
  width: number;
  height: number;
}

export function calculateResize(
  original: Dimensions,
  target: Partial<Dimensions>,
  maintainAspectRatio: boolean
): Dimensions {
  const { width: ow, height: oh } = original;
  let { width, height } = target;

  if (maintainAspectRatio) {
    if (width && !height) {
      height = Math.round((width / ow) * oh);
    } else if (height && !width) {
      width = Math.round((height / oh) * ow);
    } else if (width && height) {
      // Both provided: fit within the box while preserving aspect ratio.
      const scale = Math.min(width / ow, height / oh);
      width = Math.round(ow * scale);
      height = Math.round(oh * scale);
    }
  }

  return {
    width: Math.max(1, Math.round(width ?? ow)),
    height: Math.max(1, Math.round(height ?? oh)),
  };
}

/**
 * Encodes a lossy format (JPEG or WebP) at the best quality that stays within `maxBytes`.
 * Binary-searches quality between 0.3 and `maxQuality`; if even 0.3 is too big the picture
 * is shrunk by 15% and tried again (unless `allowShrink` is false, for exact pixel sizes: then
 * the lowest-quality blob comes back with `fits: false`). Returns the blob and the canvas it
 * was encoded from.
 */
export async function encodeUnderLimit(
  canvas: HTMLCanvasElement,
  format: Exclude<OutputImageFormat, "png">,
  maxQuality: number,
  maxBytes: number,
  allowShrink = true
): Promise<{ blob: Blob; canvas: HTMLCanvasElement; fits: boolean }> {
  let current = canvas;
  for (let round = 0; round < 8; round++) {
    const floor = await canvasToBlob(current, format, 0.3);
    if (floor.size <= maxBytes) {
      let best = floor;
      let lo = 0.3;
      let hi = Math.min(0.95, maxQuality);
      for (let i = 0; i < 6; i++) {
        const mid = (lo + hi) / 2;
        const blob = await canvasToBlob(current, format, mid);
        if (blob.size <= maxBytes) {
          best = blob;
          lo = mid;
        } else {
          hi = mid;
        }
      }
      return { blob: best, canvas: current, fits: true };
    }
    if (!allowShrink) return { blob: floor, canvas: current, fits: false };
    const next = document.createElement("canvas");
    next.width = Math.max(1, Math.round(current.width * 0.85));
    next.height = Math.max(1, Math.round(current.height * 0.85));
    const ctx = next.getContext("2d");
    if (!ctx) throw new Error("Canvas is not supported in this browser.");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(current, 0, 0, next.width, next.height);
    current = next;
  }
  return { blob: await canvasToBlob(current, format, 0.3), canvas: current, fits: false };
}

/** Copy of `source` flattened onto a white background (JPEG has no transparency). */
export function flattenOnWhite(source: HTMLCanvasElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(source, 0, 0);
  return canvas;
}

const mimeToFormat: Record<string, OutputImageFormat> = {
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
};

/** The output format a blob is already encoded in (JPEG when unknown). */
export function blobFormat(blob: Blob): OutputImageFormat {
  return mimeToFormat[blob.type] ?? "jpeg";
}

/** Re-encodes an image blob in another format; returns it untouched when it already matches. */
export async function convertImageBlob(
  blob: Blob,
  format: OutputImageFormat,
  quality = 0.92
): Promise<Blob> {
  if (blobFormat(blob) === format && blob.type) return blob;
  const bitmap = await loadImageBitmap(blob);
  const canvas = drawBitmapToCanvas(bitmap, bitmap.width, bitmap.height);
  bitmap.close();
  return canvasToBlob(format === "jpeg" ? flattenOnWhite(canvas) : canvas, format, quality);
}
