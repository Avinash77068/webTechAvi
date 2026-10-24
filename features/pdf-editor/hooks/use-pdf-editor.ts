"use client";

import { useEffect, useRef, useState } from "react";
import { downloadBlob } from "@/lib/download";
import { exportOverlaysToPdf } from "@/lib/pdf/overlays-export";
import type { ImageOverlay, Overlay, RectOverlay, TextOverlay } from "@/lib/pdf/overlay-types";
import { stripExtension } from "@/lib/validation";
import {
  DEFAULT_FONT_SIZE,
  DEFAULT_IMAGE_WIDTH_FRAC,
  DEFAULT_TEXT,
  DEFAULT_ZOOM_INDEX,
  EXISTING_TEXT_COVER_PADDING,
  RECT_DEFAULTS,
  TEXT_COLORS,
  ZOOM_LEVELS,
} from "../constants";
import type { EditorTool } from "../types";
import { clampPosition, findTextRunAt, textRunBounds } from "../utils";
import { useOverlays } from "./use-overlays";
import { usePdfPages } from "./use-pdf-pages";

interface ImageAsset {
  label: ImageOverlay["label"];
  bytes: ArrayBuffer;
  format: ImageOverlay["format"];
  url: string;
  aspect: number;
}

function measureImage(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new Error("This image couldn't be read."));
    image.src = url;
  });
}

export function usePdfEditor() {
  const pages = usePdfPages();
  const overlayState = useOverlays();
  const [tool, setTool] = useState<EditorTool>("select");
  const [zoomIndex, setZoomIndex] = useState(DEFAULT_ZOOM_INDEX);
  const [signature, setSignature] = useState<ImageAsset | null>(null);
  const [imageAsset, setImageAsset] = useState<ImageAsset | null>(null);
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [pendingPlacement, setPendingPlacement] = useState<{ x: number; y: number } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportErrors, setExportErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const assetUrls = useRef<Set<string>>(new Set());
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { overlays, add, addMany, clear, select } = overlayState;
  const { currentPage, pageSize } = pages;

  useEffect(() => {
    const urls = assetUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  function placeAt(x: number, y: number, asset?: ImageAsset) {
    if (!pageSize) return;
    const pageIndex = currentPage - 1;
    const id = crypto.randomUUID();
    let overlay: Overlay | null = null;

    if (tool === "text") {
      const text: TextOverlay = { id, type: "text", pageIndex, x, y, text: DEFAULT_TEXT, fontSize: DEFAULT_FONT_SIZE, color: TEXT_COLORS[0], bold: false };
      overlay = text;
    } else if (tool === "highlight" || tool === "cover") {
      const label = tool === "highlight" ? "Highlight" : "Cover";
      const rect: RectOverlay = { id, type: "rect", label, pageIndex, x, y, ...RECT_DEFAULTS[label] };
      overlay = rect;
    } else if (asset) {
      const image: ImageOverlay = {
        id,
        type: "image",
        label: asset.label,
        pageIndex,
        x,
        y,
        widthFrac: DEFAULT_IMAGE_WIDTH_FRAC,
        aspect: asset.aspect,
        bytes: asset.bytes,
        format: asset.format,
        url: asset.url,
      };
      overlay = image;
    }
    if (!overlay) return;
    add({ ...overlay, ...clampPosition(overlay, pageSize, x, y) });
    setTool("select");
  }

  /** Replaces a piece of existing PDF text: covers the original and opens an editable copy on top. */
  function editExistingText(x: number, y: number): boolean {
    if (!pageSize) return false;
    const run = findTextRunAt(pages.textRuns, x * pageSize.width, y * pageSize.height);
    if (!run) return false;
    const box = textRunBounds(run);
    const pad = EXISTING_TEXT_COVER_PADDING;
    const pageIndex = currentPage - 1;
    const cover: RectOverlay = {
      id: crypto.randomUUID(),
      type: "rect",
      label: "Cover",
      pageIndex,
      x: (box.left - pad) / pageSize.width,
      y: (box.top - pad) / pageSize.height,
      widthFrac: (box.width + pad * 2) / pageSize.width,
      heightFrac: (box.height + pad * 2) / pageSize.height,
      color: "#ffffff",
      opacity: 1,
    };
    const text: TextOverlay = {
      id: crypto.randomUUID(),
      type: "text",
      pageIndex,
      x: box.left / pageSize.width,
      y: box.top / pageSize.height,
      text: run.text,
      fontSize: Math.round(run.fontSize * 10) / 10,
      color: TEXT_COLORS[0],
      bold: false,
    };
    addMany([cover, text]);
    setEditingId(text.id);
    return true;
  }

  /** Handles a click on the page with the active tool. */
  function handlePageClick(x: number, y: number) {
    if (tool === "select") {
      if (!editExistingText(x, y)) select(null);
    } else if (tool === "signature") {
      if (signature) placeAt(x, y, signature);
      else {
        setPendingPlacement({ x, y });
        setSignatureDialogOpen(true);
      }
    } else if (tool === "image") {
      if (imageAsset) placeAt(x, y, imageAsset);
      else {
        setPendingPlacement({ x, y });
        imageInputRef.current?.click();
      }
    } else {
      placeAt(x, y);
    }
  }

  async function createAsset(blob: Blob, label: ImageAsset["label"], format: ImageAsset["format"]): Promise<ImageAsset> {
    const url = URL.createObjectURL(blob);
    assetUrls.current.add(url);
    const { width, height } = await measureImage(url);
    return { label, bytes: await blob.arrayBuffer(), format, url, aspect: height / width };
  }

  async function saveSignature(blob: Blob) {
    const asset = await createAsset(blob, "Signature", "png");
    setSignature(asset);
    setSignatureDialogOpen(false);
    if (pendingPlacement) placeAt(pendingPlacement.x, pendingPlacement.y, asset);
    setPendingPlacement(null);
  }

  function cancelSignature() {
    setSignatureDialogOpen(false);
    setPendingPlacement(null);
  }

  async function chooseImage(file: File) {
    try {
      const asset = await createAsset(file, "Image", file.type === "image/png" ? "png" : "jpg");
      setImageAsset(asset);
      if (pendingPlacement) placeAt(pendingPlacement.x, pendingPlacement.y, asset);
    } catch (error) {
      setExportErrors([error instanceof Error ? error.message : "This image couldn't be read."]);
    }
    setPendingPlacement(null);
  }

  function chooseTool(next: EditorTool) {
    setTool((current) => (current === next ? "select" : next));
  }

  async function exportPdf() {
    if (!pages.file) return;
    if (overlays.length === 0) {
      setExportErrors(["Add at least one edit before exporting."]);
      return;
    }
    setExportErrors([]);
    setIsExporting(true);
    try {
      const { bytes, hadUnsupportedText } = await exportOverlaysToPdf(pages.file, overlays);
      setResultBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }));
      setWarnings(
        hadUnsupportedText
          ? ["Some characters (for example non-Latin scripts) can't be drawn with the PDF's built-in fonts and were replaced with \"?\"."]
          : [],
      );
    } catch (error) {
      setExportErrors([error instanceof Error ? error.message : "Failed to export this PDF."]);
    } finally {
      setIsExporting(false);
    }
  }

  function download() {
    if (resultBlob && pages.file) downloadBlob(resultBlob, `${stripExtension(pages.file.name)}-edited.pdf`);
  }

  function reset() {
    pages.close();
    clear();
    setResultBlob(null);
    setExportErrors([]);
    setWarnings([]);
    setTool("select");
    setSignature(null);
    setImageAsset(null);
  }

  return {
    pages,
    overlayState,
    tool,
    chooseTool,
    zoom: ZOOM_LEVELS[zoomIndex],
    canZoomIn: zoomIndex < ZOOM_LEVELS.length - 1,
    canZoomOut: zoomIndex > 0,
    zoomIn: () => setZoomIndex((i) => Math.min(i + 1, ZOOM_LEVELS.length - 1)),
    zoomOut: () => setZoomIndex((i) => Math.max(i - 1, 0)),
    handlePageClick,
    editingId,
    endEditing: () => setEditingId(null),
    signatureDialogOpen,
    saveSignature,
    cancelSignature,
    imageInputRef,
    chooseImage,
    isExporting,
    errors: [...pages.errors, ...exportErrors],
    dismissErrors: () => {
      pages.setErrors([]);
      setExportErrors([]);
    },
    warnings,
    resultBlob,
    exportPdf,
    download,
    reset,
    backToEditing: () => setResultBlob(null),
  };
}
