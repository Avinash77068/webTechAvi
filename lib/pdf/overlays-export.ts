import { StandardFonts, degrees, rgb } from "pdf-lib";
import type { Overlay } from "@/lib/pdf/overlay-types";
import { loadPdfLibDoc } from "@/lib/pdf/pdf-lib-utils";
import { hasUnsupportedCharacters, toLatin1 } from "@/lib/pdf/text-encoding";

/** Distance from the top of a text box to its first baseline, as a multiple of the font size. */
export const TEXT_BASELINE_RATIO = 0.86;
export const TEXT_LINE_HEIGHT_RATIO = 1.2;

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  const full = value.length === 3 ? value.replace(/./g, (c) => c + c) : value;
  const n = Number.parseInt(full, 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

/**
 * Converts a point measured from the top-left of the page as displayed (rotation applied)
 * into PDF user space of the unrotated page.
 */
function toPdfPoint(angle: number, width: number, height: number, px: number, py: number) {
  switch (angle) {
    case 90:
      return { x: py, y: px };
    case 180:
      return { x: width - px, y: py };
    case 270:
      return { x: width - py, y: height - px };
    default:
      return { x: px, y: height - py };
  }
}

/** Draws overlays on top of a PDF's pages. Existing page content is left untouched. */
export async function exportOverlaysToPdf(
  file: File,
  overlays: Overlay[],
): Promise<{ bytes: Uint8Array; hadUnsupportedText: boolean }> {
  const doc = await loadPdfLibDoc(file);
  const fonts = {
    regular: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
  };
  const pages = doc.getPages();
  let hadUnsupportedText = false;

  for (const overlay of overlays) {
    const page = pages[overlay.pageIndex];
    if (!page) continue;
    const { width, height } = page.getSize();
    const angle = (((page.getRotation().angle % 360) + 360) % 360) as 0 | 90 | 180 | 270;
    const visualWidth = angle === 90 || angle === 270 ? height : width;
    const visualHeight = angle === 90 || angle === 270 ? width : height;
    const rotate = degrees(angle);

    if (overlay.type === "text") {
      if (hasUnsupportedCharacters(overlay.text)) hadUnsupportedText = true;
      const font = overlay.bold ? fonts.bold : fonts.regular;
      toLatin1(overlay.text)
        .split("\n")
        .forEach((line, index) => {
          const baseline = overlay.y * visualHeight + (TEXT_BASELINE_RATIO + index * TEXT_LINE_HEIGHT_RATIO) * overlay.fontSize;
          const { x, y } = toPdfPoint(angle, width, height, overlay.x * visualWidth, baseline);
          page.drawText(line, { x, y, size: overlay.fontSize, font, color: hexToRgb(overlay.color), rotate });
        });
    } else if (overlay.type === "image") {
      const embedded = overlay.format === "png" ? await doc.embedPng(overlay.bytes) : await doc.embedJpg(overlay.bytes);
      const drawWidth = overlay.widthFrac * visualWidth;
      const drawHeight = drawWidth * overlay.aspect;
      const { x, y } = toPdfPoint(angle, width, height, overlay.x * visualWidth, overlay.y * visualHeight + drawHeight);
      page.drawImage(embedded, { x, y, width: drawWidth, height: drawHeight, rotate });
    } else {
      const drawWidth = overlay.widthFrac * visualWidth;
      const drawHeight = overlay.heightFrac * visualHeight;
      const { x, y } = toPdfPoint(angle, width, height, overlay.x * visualWidth, overlay.y * visualHeight + drawHeight);
      page.drawRectangle({
        x,
        y,
        width: drawWidth,
        height: drawHeight,
        color: hexToRgb(overlay.color),
        opacity: overlay.opacity,
        rotate,
      });
    }
  }

  return { bytes: await doc.save(), hadUnsupportedText };
}
