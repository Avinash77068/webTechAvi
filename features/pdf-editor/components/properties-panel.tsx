"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Overlay } from "@/lib/pdf/overlay-types";
import { cn } from "@/lib/utils";
import { FONT_SIZES, HIGHLIGHT_COLORS, MIN_OVERLAY_FRAC, TEXT_COLORS } from "../constants";

function ColorSwatches({ colors, value, onPick }: { colors: string[]; value: string; onPick: (color: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          aria-label={`Color ${color}`}
          aria-pressed={value === color}
          onClick={() => onPick(color)}
          style={{ backgroundColor: color }}
          className={cn("size-6 rounded-full border border-border", value === color && "ring-2 ring-primary ring-offset-2 ring-offset-background")}
        />
      ))}
    </div>
  );
}

interface PropertiesPanelProps {
  overlay: Overlay;
  onBeginChange: () => void;
  onChange: (updater: (overlay: Overlay) => Overlay) => void;
  onRemove: () => void;
}

export function PropertiesPanel({ overlay, onBeginChange, onChange, onRemove }: PropertiesPanelProps) {
  const title = overlay.type === "text" ? "Text" : overlay.label;

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          {title} <span className="font-normal text-muted-foreground">· page {overlay.pageIndex + 1}</span>
        </h3>
        <Button type="button" size="sm" variant="outline" onClick={onRemove}>
          <Trash2 className="size-3.5" aria-hidden="true" />
          Delete
        </Button>
      </div>

      {overlay.type === "text" && (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="overlay-text">Text</Label>
            <Textarea
              id="overlay-text"
              rows={3}
              value={overlay.text}
              onFocus={onBeginChange}
              onChange={(event) => onChange((o) => (o.type === "text" ? { ...o, text: event.target.value } : o))}
            />
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="overlay-size">Size</Label>
              <select
                id="overlay-size"
                value={overlay.fontSize}
                onChange={(event) => {
                  onBeginChange();
                  onChange((o) => (o.type === "text" ? { ...o, fontSize: Number(event.target.value) } : o));
                }}
                className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"
              >
                {FONT_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size} pt
                  </option>
                ))}
              </select>
            </div>
            <Button
              type="button"
              size="sm"
              variant={overlay.bold ? "default" : "outline"}
              aria-pressed={overlay.bold}
              onClick={() => {
                onBeginChange();
                onChange((o) => (o.type === "text" ? { ...o, bold: !o.bold } : o));
              }}
            >
              Bold
            </Button>
          </div>
          <div className="space-y-1.5">
            <Label>Color</Label>
            <ColorSwatches
              colors={TEXT_COLORS}
              value={overlay.color}
              onPick={(color) => {
                onBeginChange();
                onChange((o) => (o.type === "text" ? { ...o, color } : o));
              }}
            />
          </div>
        </>
      )}

      {overlay.type === "rect" && (
        <>
          <div className="space-y-1.5">
            <Label>Color</Label>
            <ColorSwatches
              colors={overlay.label === "Highlight" ? HIGHLIGHT_COLORS : ["#ffffff", "#111827"]}
              value={overlay.color}
              onPick={(color) => {
                onBeginChange();
                onChange((o) => (o.type === "rect" ? { ...o, color } : o));
              }}
            />
          </div>
          {overlay.label === "Highlight" && (
            <div className="space-y-1.5">
              <Label htmlFor="overlay-opacity">Opacity · {Math.round(overlay.opacity * 100)}%</Label>
              <input
                id="overlay-opacity"
                type="range"
                min={10}
                max={100}
                value={Math.round(overlay.opacity * 100)}
                onPointerDown={onBeginChange}
                onChange={(event) => onChange((o) => (o.type === "rect" ? { ...o, opacity: Number(event.target.value) / 100 } : o))}
                className="w-full accent-primary"
              />
            </div>
          )}
        </>
      )}

      {overlay.type === "image" && (
        <div className="space-y-1.5">
          <Label htmlFor="overlay-width">Width · {Math.round(overlay.widthFrac * 100)}% of page</Label>
          <input
            id="overlay-width"
            type="range"
            min={Math.round(MIN_OVERLAY_FRAC * 100)}
            max={100}
            value={Math.round(overlay.widthFrac * 100)}
            onPointerDown={onBeginChange}
            onChange={(event) => onChange((o) => (o.type === "image" ? { ...o, widthFrac: Number(event.target.value) / 100 } : o))}
            className="w-full accent-primary"
          />
        </div>
      )}
    </div>
  );
}
