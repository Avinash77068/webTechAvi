import type { RectOverlay } from "@/lib/pdf/overlay-types";

/** Width the page preview is drawn at when zoom is 100%, in CSS pixels. */
export const PREVIEW_BASE_WIDTH = 700;
/** Resolution the page is rendered at, so it stays sharp up to the maximum zoom. */
export const PREVIEW_RENDER_WIDTH = 1400;

export const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2];
export const DEFAULT_ZOOM_INDEX = 2;

export const HISTORY_LIMIT = 50;

export const FONT_SIZES = [10, 12, 14, 16, 20, 24, 32, 48];
export const DEFAULT_FONT_SIZE = 16;
export const DEFAULT_TEXT = "Text";

export const TEXT_COLORS = ["#111827", "#dc2626", "#2563eb", "#16a34a", "#9333ea", "#ffffff"];
export const HIGHLIGHT_COLORS = ["#facc15", "#4ade80", "#38bdf8", "#f472b6", "#fb923c"];

export const DEFAULT_IMAGE_WIDTH_FRAC = 0.25;
export const MIN_OVERLAY_FRAC = 0.03;

export const RECT_DEFAULTS: Record<RectOverlay["label"], Pick<RectOverlay, "color" | "opacity" | "widthFrac" | "heightFrac">> = {
  Highlight: { color: "#facc15", opacity: 0.4, widthFrac: 0.3, heightFrac: 0.03 },
  Cover: { color: "#ffffff", opacity: 1, widthFrac: 0.3, heightFrac: 0.05 },
};

export const IMAGE_ACCEPT = "image/png,image/jpeg";
export const IMAGE_MIME_TYPES = ["image/png", "image/jpeg"];
export const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg"];

/** Extra space around existing text that is covered when it is replaced, in PDF points. */
export const EXISTING_TEXT_COVER_PADDING = 1.5;
