"use client";

import { useRef } from "react";
import type { Overlay } from "@/lib/pdf/overlay-types";
import { cn } from "@/lib/utils";
import { PREVIEW_BASE_WIDTH } from "../constants";
import type { EditorTool, PageSize } from "../types";
import { OverlayView } from "./overlay-view";

interface PageCanvasProps {
  imageUrl: string | null;
  pageNumber: number;
  pageSize: PageSize | null;
  zoom: number;
  tool: EditorTool;
  overlays: Overlay[];
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
  selectedId,
  onPageClick,
  onSelect,
  onBeginChange,
  onChange,
}: PageCanvasProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const width = PREVIEW_BASE_WIDTH * zoom;
  const scale = pageSize ? width / pageSize.width : 1;

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    onPageClick((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height);
  }

  return (
    <div className="overflow-auto rounded-xl border border-border bg-muted/30 p-4">
      <div
        ref={pageRef}
        onClick={handleClick}
        style={{ width, aspectRatio: pageSize ? `${pageSize.width} / ${pageSize.height}` : "1 / 1.414" }}
        className={cn("relative mx-auto bg-white shadow-md", tool !== "select" && "cursor-crosshair")}
      >
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={`Page ${pageNumber}`} draggable={false} className="size-full select-none" />
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
            />
          ))}
      </div>
    </div>
  );
}
