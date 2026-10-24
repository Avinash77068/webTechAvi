"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";

export function SignaturePad({
  onSave,
  onCancel,
}: {
  onSave: (blob: Blob) => void;
  onCancel: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const hasDrawnRef = useRef(false);

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    drawingRef.current = true;
    lastPointRef.current = getPos(e);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current || !lastPointRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPointRef.current = pos;
    hasDrawnRef.current = true;
  }

  function stopDrawing() {
    drawingRef.current = false;
    lastPointRef.current = null;
  }

  function clear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawnRef.current = false;
  }

  function save() {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawnRef.current) return;
    canvas.toBlob((blob) => {
      if (blob) onSave(blob);
    }, "image/png");
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <canvas
          ref={canvasRef}
          width={500}
          height={200}
          className="h-[200px] w-full touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
        />
      </div>
      <p className="text-xs text-muted-foreground">Draw your signature above using your mouse, stylus or finger.</p>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={clear}>
          Clear
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={save}>
          Use signature
        </Button>
      </div>
    </div>
  );
}
