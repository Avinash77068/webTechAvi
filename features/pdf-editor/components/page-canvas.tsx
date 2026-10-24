"use client";

import { useRef, useState } from "react";
import type { PdfTextRun } from "@/lib/pdf/pdfjs-client";
import type { Overlay } from "@/lib/pdf/overlay-types";
import { cn } from "@/lib/utils";
import { PREVIEW_BASE_WIDTH } from "../constants";
import type { EditorTool, PageSize } from "../types";
import { findTextRunAt, textRunBounds } from "../utils";
import { OverlayView } from "./overlay-view";

interface PageCanvasProps {
  imageUrl: string | null;
  pageNumber: number;
  pageSize: PageSize | null;
  zoom: number;
  tool: EditorTool;
  overlays: Overlay[];
  textRuns: PdfTextRun[];
  editingId: string | null;
  onEditEnd: () => void;
  selectedId: string | null;
  onPageClick: (x: number, y: number) => void;
  onSelect: (id: string) => void;
  onBeginChange: () => void;
  onChange: (id: string, updater: (overlay: Overlay) => Overlay) => void;
}

export function PageCanvas({
  imageUrl,
  pageNumber,
  pageSize,
  zoom,
  tool,
  overlays,
  textRuns,
  editingId,
  onEditEnd,
  selectedId,
  onPageClick,
  onSelect,
  onBeginChange,
  onChange,
}: PageCanvasProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const width = PREVIEW_BASE_WIDTH * zoom;
  const scale = pageSize ? width / pageSize.width : 1;
  const [hoveredRun, setHoveredRun] = useState<PdfTextRun | null>(null);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (tool !== "select" || !pageSize) {
      if (hoveredRun) setHoveredRun(null);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const run = findTextRunAt(
      textRuns,
      ((event.clientX - rect.left) / rect.width) * pageSize.width,
      ((event.clientY - rect.top) / rect.height) * pageSize.height,
    );
    if (run !== hoveredRun) setHoveredRun(run);
  }

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    onPageClick((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height);
  }

  return (
    <div className="overflow-auto rounded-xl border border-border bg-muted/30 p-4">
      <div
        ref={pageRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredRun(null)}
        style={{ width, aspectRatio: pageSize ? `${pageSize.width} / ${pageSize.height}` : "1 / 1.414" }}
        className={cn("relative mx-auto bg-white shadow-md", tool !== "select" && "cursor-crosshair", hoveredRun && "cursor-text")}
      >
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={`Page ${pageNumber}`} draggable={false} className="size-full select-none" />
        )}
        {pageSize && hoveredRun && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute rounded-sm outline outline-1 outline-dashed outline-primary bg-primary/10"
            style={{
              left: `${(textRunBounds(hoveredRun).left / pageSize.width) * 100}%`,
              top: `${(textRunBounds(hoveredRun).top / pageSize.height) * 100}%`,
              width: `${(textRunBounds(hoveredRun).width / pageSize.width) * 100}%`,
              height: `${(textRunBounds(hoveredRun).height / pageSize.height) * 100}%`,
            }}
          />
        )}
        {pageSize &&
          overlays.map((overlay) => (
            <OverlayView
              key={overlay.id}
              overlay={overlay}
              page={pageSize}
              scale={scale}
              selected={overlay.id === selectedId}
              getPageRect={() => pageRef.current?.getBoundingClientRect() ?? null}
              onSelect={() => onSelect(overlay.id)}
              onBeginChange={onBeginChange}
              onChange={(updater) => onChange(overlay.id, updater)}
              startEditing={overlay.id === editingId}
              onEditEnd={onEditEnd}
            />
          ))}
      </div>
    </div>
  );
}
