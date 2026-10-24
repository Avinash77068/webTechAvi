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
