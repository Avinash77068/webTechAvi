"use client";

import { useRef, useState } from "react";
import type { Overlay } from "@/lib/pdf/overlay-types";
import { cn } from "@/lib/utils";
import { MIN_OVERLAY_FRAC } from "../constants";
import type { PageSize } from "../types";
import { clamp, clampPosition } from "../utils";
import { TEXT_LINE_HEIGHT_RATIO } from "@/lib/pdf/overlays-export";

interface DragState {
  mode: "move" | "resize";
  startX: number;
  startY: number;
  origin: Overlay;
}

interface OverlayViewProps {
  overlay: Overlay;
  page: PageSize;
  /** On-screen pixels per PDF point. */
  scale: number;
  selected: boolean;
  getPageRect: () => DOMRect | null;
  onSelect: () => void;
  onBeginChange: () => void;
  onChange: (updater: (overlay: Overlay) => Overlay) => void;
  /** Opens the text for editing as soon as the overlay appears. */
  startEditing?: boolean;
  onEditEnd?: () => void;
}

export function OverlayView({ overlay, page, scale, selected, getPageRect, onSelect, onBeginChange, onChange, startEditing = false, onEditEnd }: OverlayViewProps) {
  const drag = useRef<DragState | null>(null);
  const [editing, setEditing] = useState(startEditing);

  function start(event: React.PointerEvent, mode: DragState["mode"]) {
    event.stopPropagation();
    if (editing) return;
    onSelect();
    onBeginChange();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { mode, startX: event.clientX, startY: event.clientY, origin: overlay };
  }

  function move(event: React.PointerEvent) {
    const state = drag.current;
    const rect = getPageRect();
    if (!state || !rect) return;
    const dx = (event.clientX - state.startX) / rect.width;
    const dy = (event.clientY - state.startY) / rect.height;
    const origin = state.origin;

    if (state.mode === "move") {
      const position = clampPosition(origin, page, origin.x + dx, origin.y + dy);
      onChange((current) => ({ ...current, ...position }));
    } else if (origin.type === "image") {
      const widthFrac = clamp(origin.widthFrac + dx, MIN_OVERLAY_FRAC, 1 - origin.x);
      onChange((current) => (current.type === "image" ? { ...current, widthFrac } : current));
    } else if (origin.type === "rect") {
      const widthFrac = clamp(origin.widthFrac + dx, MIN_OVERLAY_FRAC, 1 - origin.x);
      const heightFrac = clamp(origin.heightFrac + dy, MIN_OVERLAY_FRAC / 2, 1 - origin.y);
      onChange((current) => (current.type === "rect" ? { ...current, widthFrac, heightFrac } : current));
    }
  }

  function stopEditing() {
    setEditing(false);
    onEditEnd?.();
  }

  function end() {
    drag.current = null;
  }

  const style: React.CSSProperties = {
    position: "absolute",
    left: `${overlay.x * 100}%`,
    top: `${overlay.y * 100}%`,
    touchAction: "none",
  };

  let content: React.ReactNode;
  if (overlay.type === "text") {
    const textStyle: React.CSSProperties = {
      display: "block",
      fontSize: overlay.fontSize * scale,
      lineHeight: TEXT_LINE_HEIGHT_RATIO,
      color: overlay.color,
      fontWeight: overlay.bold ? 700 : 400,
      fontFamily: "Helvetica, Arial, sans-serif",
      whiteSpace: "pre",
    };
    content = editing ? (
      <textarea
        autoFocus
        value={overlay.text}
        rows={overlay.text.split("\n").length}
        aria-label="Edit text"
        onFocus={(event) => event.currentTarget.select()}
        onChange={(event) => onChange((o) => (o.type === "text" ? { ...o, text: event.target.value } : o))}
        onBlur={stopEditing}
        onKeyDown={(event) => {
          event.stopPropagation();
          if (event.key === "Escape" || (event.key === "Enter" && (event.metaKey || event.ctrlKey))) stopEditing();
        }}
        onPointerDown={(event) => event.stopPropagation()}
        style={{ ...textStyle, fieldSizing: "content", minWidth: "2ch", resize: "none", overflow: "hidden", margin: 0, padding: 0, border: 0, background: "transparent", outline: "none" }}
      />
    ) : (
      <span style={textStyle}>{overlay.text}</span>
    );
  } else if (overlay.type === "image") {
    style.width = `${overlay.widthFrac * 100}%`;
    // eslint-disable-next-line @next/next/no-img-element
    content = <img src={overlay.url} alt={overlay.label} draggable={false} className="block w-full select-none" />;
  } else {
    style.width = `${overlay.widthFrac * 100}%`;
    style.height = `${overlay.heightFrac * 100}%`;
    content = <div className="size-full" style={{ backgroundColor: overlay.color, opacity: overlay.opacity }} />;
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${overlay.type === "text" ? "Text" : overlay.label} overlay`}
      style={style}
      className={cn(
        editing ? "cursor-text" : "cursor-move",
        "outline-offset-2 hover:outline hover:outline-1 hover:outline-primary/60",
        selected && "outline outline-2 outline-primary",
      )}
      onPointerDown={(event) => start(event, "move")}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      onClick={(event) => event.stopPropagation()}
      onDoubleClick={() => {
        if (overlay.type !== "text") return;
        onBeginChange();
        setEditing(true);
      }}
      onFocus={onSelect}
    >
      {content}
      {selected && overlay.type !== "text" && (
        <span
          aria-hidden="true"
          className="absolute -right-1.5 -bottom-1.5 size-3.5 cursor-nwse-resize rounded-sm border-2 border-background bg-primary"
          onPointerDown={(event) => start(event, "resize")}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
        />
      )}
    </div>
  );
}
