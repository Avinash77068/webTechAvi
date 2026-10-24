"use client";

import {
  ChevronLeft,
  ChevronRight,
  Eraser,
  Highlighter,
  ImagePlus,
  MousePointer2,
  PenTool,
  Redo2,
  Type,
  Undo2,
  ZoomIn,
  ZoomOut,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EditorTool } from "../types";

const TOOLS: { tool: EditorTool; label: string; icon: LucideIcon }[] = [
  { tool: "select", label: "Select", icon: MousePointer2 },
  { tool: "text", label: "Text", icon: Type },
  { tool: "signature", label: "Signature", icon: PenTool },
  { tool: "image", label: "Image", icon: ImagePlus },
  { tool: "highlight", label: "Highlight", icon: Highlighter },
  { tool: "cover", label: "Cover", icon: Eraser },
];

const HINTS: Record<EditorTool, string> = {
  select: "Click an item to select it. Drag to move, drag the corner handle to resize, double-click text to edit it.",
  text: "Click on the page to place a text box.",
  signature: "Click on the page to place your signature.",
  image: "Click on the page to place an image.",
  highlight: "Click on the page to add a highlight, then move and resize it.",
  cover: "Click on the page to add a white box that hides what's underneath.",
};

interface EditorToolbarProps {
  tool: EditorTool;
  onToolChange: (tool: EditorTool) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  zoom: number;
  canZoomIn: boolean;
  canZoomOut: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export function EditorToolbar({
  tool,
  onToolChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  zoom,
  canZoomIn,
  canZoomOut,
  onZoomIn,
  onZoomOut,
  currentPage,
  pageCount,
  onPageChange,
}: EditorToolbarProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
        <div role="toolbar" aria-label="Editing tools" className="flex flex-wrap items-center gap-1">
          {TOOLS.map(({ tool: value, label, icon: Icon }) => (
            <Button
              key={value}
              type="button"
              size="sm"
              variant={tool === value ? "default" : "outline"}
              aria-pressed={tool === value}
              onClick={() => onToolChange(value)}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </Button>
          ))}
          <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
          <Button type="button" size="icon-sm" variant="ghost" aria-label="Undo" title="Undo (Ctrl+Z)" disabled={!canUndo} onClick={onUndo}>
            <Undo2 className="size-4" aria-hidden="true" />
          </Button>
          <Button type="button" size="icon-sm" variant="ghost" aria-label="Redo" title="Redo (Ctrl+Shift+Z)" disabled={!canRedo} onClick={onRedo}>
            <Redo2 className="size-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Button type="button" size="icon-sm" variant="outline" aria-label="Zoom out" disabled={!canZoomOut} onClick={onZoomOut}>
              <ZoomOut className="size-4" aria-hidden="true" />
            </Button>
            <span className="w-11 text-center text-sm text-muted-foreground">{Math.round(zoom * 100)}%</span>
            <Button type="button" size="icon-sm" variant="outline" aria-label="Zoom in" disabled={!canZoomIn} onClick={onZoomIn}>
              <ZoomIn className="size-4" aria-hidden="true" />
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button type="button" size="icon-sm" variant="outline" aria-label="Previous page" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
              <ChevronLeft className="size-4" aria-hidden="true" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {pageCount}
            </span>
            <Button type="button" size="icon-sm" variant="outline" aria-label="Next page" disabled={currentPage >= pageCount} onClick={() => onPageChange(currentPage + 1)}>
              <ChevronRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{HINTS[tool]}</p>
    </div>
  );
}
