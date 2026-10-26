"use client";

import { useEffect, useImperativeHandle, useRef, type PointerEvent, type Ref } from "react";

export interface PadApi {
  /** Ink on a transparent canvas, or null when nothing is drawn. */
  toCanvas: () => HTMLCanvasElement | null;
  undo: () => void;
  clear: () => void;
}

interface Stroke {
  pts: { x: number; y: number }[];
}

export const PAD_W = 900;
export const PAD_H = 300;

function paint(ctx: CanvasRenderingContext2D, strokes: Stroke[], ink: string, width: number) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = ink;
  ctx.fillStyle = ink;
  ctx.lineWidth = width;
  for (const { pts } of strokes) {
    if (pts.length === 1) {
      ctx.beginPath();
      ctx.arc(pts[0].x, pts[0].y, width / 2, 0, Math.PI * 2);
      ctx.fill();
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    // Quadratic curves through the midpoints keep fast strokes smooth.
    for (let i = 1; i < pts.length - 1; i++) {
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, (pts[i].x + pts[i + 1].x) / 2, (pts[i].y + pts[i + 1].y) / 2);
    }
    const last = pts[pts.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
  }
}

/**
 * Draw-your-signature pad for mouse, pen or finger. Strokes are kept as points and redrawn
 * on every change, so Undo works and a new ink colour or pen width recolours the whole
 * signature. The pad itself is transparent.
 */
export function DrawingPad({
  ink,
  width,
  onChange,
  ref,
}: {
  /** CSS colour of the ink. */
  ink: string;
  /** Pen width in canvas pixels (the canvas is 900 wide). */
  width: number;
  /** Called after every stroke, undo and clear. */
  onChange: (hasInk: boolean) => void;
  ref?: Ref<PadApi>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Stroke[]>([]);
  const current = useRef<Stroke | null>(null);
  const live = useRef({ ink, width, onChange });
  // Declared before the redraw effect below so it always sees the latest props.
  useEffect(() => {
    live.current = { ink, width, onChange };
  });

  function redraw() {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, PAD_W, PAD_H);
    paint(ctx, strokes.current, live.current.ink, live.current.width);
  }

  useImperativeHandle(ref, () => ({
    toCanvas() {
      if (strokes.current.length === 0) return null;
      const canvas = document.createElement("canvas");
      canvas.width = PAD_W;
      canvas.height = PAD_H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      paint(ctx, strokes.current, live.current.ink, live.current.width);
      return canvas;
    },
    undo() {
      strokes.current.pop();
      redraw();
      live.current.onChange(strokes.current.length > 0);
    },
    clear() {
      strokes.current = [];
      redraw();
      live.current.onChange(false);
    },
  }));

  useEffect(redraw, [ink, width]);

  function point(e: { clientX: number; clientY: number }) {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: ((e.clientX - rect.left) / rect.width) * PAD_W, y: ((e.clientY - rect.top) / rect.height) * PAD_H };
  }

  function onDown(e: PointerEvent<HTMLCanvasElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    current.current = { pts: [point(e)] };
    strokes.current.push(current.current);
    redraw();
  }

  function onMove(e: PointerEvent<HTMLCanvasElement>) {
    const stroke = current.current;
    if (!stroke) return;
    const events = e.nativeEvent.getCoalescedEvents?.() ?? [];
    for (const ev of events.length ? events : [e.nativeEvent]) stroke.pts.push(point(ev));
    redraw();
  }

  function onUp() {
    if (!current.current) return;
    current.current = null;
    live.current.onChange(true);
  }

  return (
    <div className="overflow-hidden rounded-xl border-2 border-dashed border-border bg-white">
      <canvas
        ref={canvasRef}
        width={PAD_W}
        height={PAD_H}
        role="img"
        aria-label="Signature drawing area"
        className="block aspect-[3/1] w-full cursor-crosshair touch-none"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      />
    </div>
  );
}
