import type { Overlay } from "@/lib/pdf/overlay-types";
import type { PdfTextRun } from "@/lib/pdf/pdfjs-client";
import { TEXT_BASELINE_RATIO, TEXT_LINE_HEIGHT_RATIO } from "@/lib/pdf/overlays-export";
import { MIN_OVERLAY_FRAC } from "./constants";
import type { PageSize } from "./types";

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Height of an overlay as a fraction of the page height, or null for text whose size depends on its content. */
export function overlayHeightFrac(overlay: Overlay, page: PageSize): number | null {
  if (overlay.type === "rect") return overlay.heightFrac;
  if (overlay.type === "image") return (overlay.widthFrac * overlay.aspect * page.width) / page.height;
  return null;
}

export function overlayWidthFrac(overlay: Overlay): number | null {
  return overlay.type === "text" ? null : overlay.widthFrac;
}

/** Keeps an overlay's top-left corner so that the whole box (when its size is known) stays on the page. */
export function clampPosition(overlay: Overlay, page: PageSize, x: number, y: number) {
  const width = overlayWidthFrac(overlay) ?? MIN_OVERLAY_FRAC;
  const height = overlayHeightFrac(overlay, page) ?? MIN_OVERLAY_FRAC;
  return { x: clamp(x, 0, 1 - Math.min(width, 1)), y: clamp(y, 0, 1 - Math.min(height, 1)) };
}

export function describeOverlay(overlay: Overlay): string {
  if (overlay.type === "text") return `"${overlay.text.split("\n")[0].slice(0, 30)}"`;
  return overlay.label;
}

/** Bounding box of an existing text run in PDF points, from the top-left of the page. */
export function textRunBounds(run: PdfTextRun) {
  const top = run.baseline - TEXT_BASELINE_RATIO * run.fontSize;
  return { left: run.x, top, width: run.width, height: TEXT_LINE_HEIGHT_RATIO * run.fontSize };
}

/** Finds the existing text run under a point given in PDF points. */
export function findTextRunAt(runs: PdfTextRun[], px: number, py: number): PdfTextRun | null {
  return (
    runs.find((run) => {
      const box = textRunBounds(run);
      return px >= box.left && px <= box.left + box.width && py >= box.top && py <= box.top + box.height;
    }) ?? null
  );
}
