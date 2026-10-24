/**
 * Overlays are positioned as fractions (0-1) of the page as it appears on screen — rotation
 * included — measured from the top-left corner of the box.
 */
interface OverlayBase {
  id: string;
  /** 0-based page index. */
  pageIndex: number;
  x: number;
  y: number;
}

export interface TextOverlay extends OverlayBase {
  type: "text";
  text: string;
  /** Font size in PDF points. */
  fontSize: number;
  /** Hex color, e.g. "#111827". */
  color: string;
  bold: boolean;
}

export interface ImageOverlay extends OverlayBase {
  type: "image";
  label: "Signature" | "Image";
  /** Width as a fraction of the page width. */
  widthFrac: number;
  /** Image height divided by image width. */
  aspect: number;
  bytes: ArrayBuffer;
  format: "png" | "jpg";
  /** Object URL used for the on-screen preview. */
  url: string;
}

export interface RectOverlay extends OverlayBase {
  type: "rect";
  label: "Highlight" | "Cover";
  widthFrac: number;
  heightFrac: number;
  color: string;
  opacity: number;
}

export type Overlay = TextOverlay | ImageOverlay | RectOverlay;
