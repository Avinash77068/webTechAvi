"use client";

import { useEffect, useRef, useState } from "react";
import { Eraser, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ErrorBanner } from "@/components/tools/error-banner";
import { ResultActions } from "@/components/tools/result-actions";
import { downloadBlob } from "@/lib/download";
import { formatBytes } from "@/lib/validation";
import { canvasToBlob, encodeUnderLimit, flattenOnWhite, loadImageBitmap } from "@/lib/image/canvas-utils";
import { hexToRgb, inkBounds, inkToTransparent } from "@/lib/image/pixels";
import { cn } from "@/lib/utils";
import { getToolBySlug } from "@/lib/tools-registry";
import { DrawingPad, type PadApi } from "./drawing-pad";

const tool = getToolBySlug("signature-maker")!;

type Mode = "draw" | "type" | "photo";
type Output = "png" | "jpg";

const INKS = {
  black: { label: "Black", hex: "#111827" },
  blue: { label: "Blue", hex: "#1b3fa8" },
  navy: { label: "Dark blue", hex: "#0b2a6f" },
} as const;
type InkKey = keyof typeof INKS;

const FONTS = {
  script: { label: "Script", stack: "'Snell Roundhand','Brush Script MT','Segoe Script','Lucida Handwriting',cursive", italic: false },
  marker: { label: "Marker", stack: "'Marker Felt','Bradley Hand','Segoe Print','Comic Sans MS',cursive", italic: false },
  classic: { label: "Classic", stack: "Georgia,'Times New Roman',serif", italic: true },
  clean: { label: "Clean", stack: "'Helvetica Neue',Arial,sans-serif", italic: true },
} as const;
type FontKey = keyof typeof FONTS;

/** Common form rules. The notice for your exam is the final word: check it. */
const SIZE_PRESETS = [
  { label: "140 × 60 px, ≤ 20 KB", w: 140, h: 60, kb: 20 },
  { label: "472 × 157 px (6 × 2 cm), ≤ 20 KB", w: 472, h: 157, kb: 20 },
  { label: "300 × 100 px, ≤ 50 KB", w: 300, h: 100, kb: 50 },
] as const;

const MAX_PNG_SIDE = 1200;

function typedCanvas(text: string, font: FontKey, ink: string): HTMLCanvasElement | null {
  if (!text.trim()) return null;
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 300;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const f = FONTS[font];
  const face = (px: number) => `${f.italic ? "italic " : ""}${px}px ${f.stack}`;
  let size = 170;
  ctx.font = face(size);
  const width = ctx.measureText(text).width;
  if (width > 840) size = Math.max(40, Math.floor((size * 840) / width));
  ctx.font = face(size);
  ctx.fillStyle = ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 450, 150);
  return canvas;
}

/** Crops to the ink with a little air around it. Null when there is no ink. */
function trimmed(source: HTMLCanvasElement): HTMLCanvasElement | null {
  const ctx = source.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  const px = ctx.getImageData(0, 0, source.width, source.height);
  const box = inkBounds(px.data, source.width, source.height);
  if (!box) return null;
  const pad = Math.max(8, Math.round(Math.max(box.w, box.h) * 0.05));
  const out = document.createElement("canvas");
  out.width = box.w + pad * 2;
  out.height = box.h + pad * 2;
  out.getContext("2d")!.drawImage(source, box.x, box.y, box.w, box.h, pad, pad, box.w, box.h);
  return out;
}

function Choice<V extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: V;
  options: { value: V; label: string }[];
  onChange: (value: V) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label={label}>
        {options.map((o) => (
          <Button key={o.value} type="button" size="sm" variant={value === o.value ? "default" : "outline"} aria-pressed={value === o.value} onClick={() => onChange(o.value)}>
            {o.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function SignatureMakerTool() {
  const [mode, setMode] = useState<Mode>("draw");
  const [inkKey, setInkKey] = useState<InkKey>("black");
  const [penWidth, setPenWidth] = useState(6);
  const [text, setText] = useState("");
  const [font, setFont] = useState<FontKey>("script");
  const [cleanup, setCleanup] = useState(60);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [photoVersion, setPhotoVersion] = useState(0);
  const [padVersion, setPadVersion] = useState(0);
  const [hasInk, setHasInk] = useState(false);
  const [output, setOutput] = useState<Output>("png");
  const [width, setWidth] = useState("140");
  const [height, setHeight] = useState("60");
  const [maxKB, setMaxKB] = useState("20");
  const [result, setResult] = useState<{ blob: Blob; url: string; width: number; height: number; fits: boolean } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const pad = useRef<PadApi>(null);
  const photo = useRef<ImageBitmap | null>(null);
  const ink = INKS[inkKey].hex;

  const ready = mode === "draw" ? hasInk : mode === "type" ? text.trim().length > 0 : photoName !== null;

  /** The signature as ink on a transparent canvas, trimmed to the ink. */
  function makeInk(): HTMLCanvasElement | null {
    if (mode === "draw") {
      const c = pad.current?.toCanvas();
      return c ? trimmed(c) : null;
    }
    if (mode === "type") {
      const c = typedCanvas(text, font, ink);
      return c ? trimmed(c) : null;
    }
    const bitmap = photo.current;
    if (!bitmap) return null;
    const k = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * k));
    canvas.height = Math.max(1, Math.round(bitmap.height * k));
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const px = ctx.getImageData(0, 0, canvas.width, canvas.height);
    inkToTransparent(px.data, hexToRgb(ink), cleanup);
    ctx.putImageData(px, 0, 0);
    return trimmed(canvas);
  }

  // Rebuild the result whenever an input changes (debounced).
  useEffect(() => {
    let cancelled = false;
    const clear = () => setResult((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
    if (!ready) {
      clear();
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const inkCanvas = makeInk();
        if (!inkCanvas) {
          clear();
          return;
        }
        let blob: Blob;
        let w: number;
        let h: number;
        let fits = true;
        if (output === "png") {
          const k = Math.min(1, MAX_PNG_SIDE / Math.max(inkCanvas.width, inkCanvas.height));
          const c = document.createElement("canvas");
          c.width = w = Math.max(1, Math.round(inkCanvas.width * k));
          c.height = h = Math.max(1, Math.round(inkCanvas.height * k));
          const ctx = c.getContext("2d")!;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(inkCanvas, 0, 0, w, h);
          blob = await canvasToBlob(c, "png", 1);
        } else {
          const W = Math.round(Number(width));
          const H = Math.round(Number(height));
          if (!(W >= 20 && W <= 4000 && H >= 20 && H <= 4000)) throw new Error("Enter a width and height between 20 and 4000 px.");
          const page = document.createElement("canvas");
          page.width = w = W;
          page.height = h = H;
          const ctx = page.getContext("2d")!;
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, W, H);
          // Ink fills the box with a small margin; the rule's pixel size is kept exactly.
          const k = Math.min((W * 0.94) / inkCanvas.width, (H * 0.88) / inkCanvas.height);
          const dw = inkCanvas.width * k;
          const dh = inkCanvas.height * k;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(inkCanvas, (W - dw) / 2, (H - dh) / 2, dw, dh);
          const limit = Number(maxKB) * 1000;
          if (maxKB.trim() !== "" && (!Number.isFinite(limit) || limit < 1000)) throw new Error("Enter a size limit of at least 1 KB, or leave it empty.");
          if (maxKB.trim() === "") {
            blob = await canvasToBlob(flattenOnWhite(page), "jpeg", 0.92);
          } else {
            const out = await encodeUnderLimit(page, "jpeg", 0.95, limit, false);
            blob = out.blob;
            fits = out.fits;
          }
        }
        if (cancelled) return;
        setErrors([]);
        setResult((prev) => {
          if (prev) URL.revokeObjectURL(prev.url);
          return { blob, url: URL.createObjectURL(blob), width: w, height: h, fits };
        });
      } catch (error) {
        if (!cancelled) setErrors([error instanceof Error ? error.message : "Couldn't make the signature."]);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // makeInk reads the same inputs listed here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, mode, ink, penWidth, text, font, cleanup, photoVersion, padVersion, output, width, height, maxKB]);

  async function handlePhoto(files: File[]) {
    const picked = files[0];
    if (!picked) return;
    setErrors([]);
    try {
      const bitmap = await loadImageBitmap(picked);
      photo.current?.close();
      photo.current = bitmap;
      setPhotoName(picked.name);
      setPhotoVersion((v) => v + 1);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Couldn't load this image."]);
    }
  }

  function startOver() {
    pad.current?.clear();
    photo.current?.close();
    photo.current = null;
    setPhotoName(null);
    setText("");
    setErrors([]);
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <section className="space-y-4 rounded-xl border border-border bg-card p-4" aria-label="Make your signature">
            <Choice
              label="How do you want to make it?"
              value={mode}
              options={[
                { value: "draw", label: "Draw" },
                { value: "type", label: "Type" },
                { value: "photo", label: "From a photo" },
              ]}
              onChange={setMode}
            />

            {/* The pad stays mounted so strokes survive switching tabs. */}
            <div className={cn("space-y-3", mode !== "draw" && "hidden")}>
              <DrawingPad
                ref={pad}
                ink={ink}
                width={penWidth}
                onChange={(h) => {
                  setHasInk(h);
                  setPadVersion((v) => v + 1);
                }}
              />
              <p className="text-sm text-muted-foreground">Sign inside the box with your finger, a pen or the mouse.</p>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" disabled={!hasInk} onClick={() => pad.current?.undo()}>
                  <Undo2 aria-hidden="true" />
                  Undo last stroke
                </Button>
                <Button type="button" variant="ghost" size="sm" disabled={!hasInk} onClick={() => pad.current?.clear()}>
                  <Eraser aria-hidden="true" />
                  Clear
                </Button>
              </div>
              <div>
                <div className="flex items-baseline justify-between text-sm">
                  <Label id="pen-width">Pen width</Label>
                  <span className="tabular-nums text-muted-foreground">{penWidth}</span>
                </div>
                <Slider aria-labelledby="pen-width" className="mt-2" min={2} max={14} step={1} value={[penWidth]} onValueChange={(v) => setPenWidth(Array.isArray(v) ? v[0] : v)} />
              </div>
            </div>

            {mode === "type" && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="sig-name">Your name</Label>
                  <Input id="sig-name" className="mt-2" value={text} maxLength={40} autoComplete="off" placeholder="Type your name" onChange={(e) => setText(e.target.value)} />
                </div>
                <Choice label="Style" value={font} options={(Object.keys(FONTS) as FontKey[]).map((k) => ({ value: k, label: FONTS[k].label }))} onChange={setFont} />
                <p className="text-sm text-muted-foreground">Most exam forms want your own handwritten signature, not a typed name. Check your notice.</p>
              </div>
            )}

            {mode === "photo" && (
              <div className="space-y-3">
                {photoName ? (
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm">
                    <span className="truncate">{photoName}</span>
                    <Button type="button" variant="outline" size="sm" onClick={() => { photo.current?.close(); photo.current = null; setPhotoName(null); }}>
                      Use a different photo
                    </Button>
                  </div>
                ) : (
                  <FileDropzone
                    accept="image/jpeg,image/png,image/webp"
                    acceptedMimeTypes={["image/jpeg", "image/png", "image/webp"]}
                    acceptedFormatsLabel={tool.acceptedFormats.join(", ")}
                    maxSizeMB={tool.maxFileSizeMB}
                    onFilesAccepted={handlePhoto}
                    onFilesRejected={setErrors}
                  />
                )}
                <p className="text-sm text-muted-foreground">Sign with a dark pen on plain white paper and photograph it from straight above, in daylight.</p>
                {photoName && (
                  <div>
                    <div className="flex items-baseline justify-between text-sm">
                      <Label id="remove-paper">Remove paper</Label>
                      <span className="tabular-nums text-muted-foreground">{cleanup}</span>
                    </div>
                    <Slider aria-labelledby="remove-paper" className="mt-2" min={0} max={100} step={5} value={[cleanup]} onValueChange={(v) => setCleanup(Array.isArray(v) ? v[0] : v)} />
                    <p className="mt-1 text-xs text-muted-foreground">Raise it if grey paper is left; lower it if thin lines disappear.</p>
                  </div>
                )}
              </div>
            )}
          </section>

          <ErrorBanner messages={errors} />

          <section aria-label="Your signature" className="rounded-xl border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Your signature</h2>
            {result ? (
              <div className="mt-3 space-y-3">
                <div
                  className="flex min-h-40 items-center justify-center rounded-lg border border-border p-4"
                  style={{
                    backgroundColor: "#fff",
                    backgroundImage:
                      "linear-gradient(45deg,#e5e7eb 25%,transparent 25%),linear-gradient(-45deg,#e5e7eb 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e5e7eb 75%),linear-gradient(-45deg,transparent 75%,#e5e7eb 75%)",
                    backgroundSize: "16px 16px",
                    backgroundPosition: "0 0,0 8px,8px -8px,-8px 0",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={result.url} alt="Your signature" className="max-h-48 max-w-full object-contain" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {result.width}&times;{result.height} px &middot; {formatBytes(result.blob.size)} &middot; {output === "png" ? "PNG, transparent background" : "JPG, white background"}
                </p>
                {!result.fits && (
                  <p role="alert" className="text-sm text-destructive">
                    This is still over {maxKB} KB at the lowest quality. Increase the pixel size or the limit.
                  </p>
                )}
                <ResultActions
                  onDownload={() => downloadBlob(result.blob, output === "png" ? "signature.png" : "signature.jpg")}
                  onReset={startOver}
                  resetLabel="Make another signature"
                />
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Draw, type or add a photo, and your signature shows up here with a Download button.</p>
            )}
          </section>
        </div>

        <div className="space-y-4">
          <section className="space-y-4 rounded-xl border border-border bg-card p-4" aria-label="Ink colour">
            <h2 className="text-sm font-semibold">Ink colour</h2>
            <Choice label="Ink" value={inkKey} options={(Object.keys(INKS) as InkKey[]).map((k) => ({ value: k, label: INKS[k].label }))} onChange={setInkKey} />
          </section>

          <section className="space-y-4 rounded-xl border border-border bg-card p-4" aria-label="Save as">
            <h2 className="text-sm font-semibold">Save as</h2>
            <Choice
              label="Output"
              value={output}
              options={[
                { value: "png", label: "Transparent PNG" },
                { value: "jpg", label: "Exact size JPG" },
              ]}
              onChange={setOutput}
            />
            <p className="text-sm text-muted-foreground">
              {output === "png" ? "No background. Use it on a PDF, a Word file or a document." : "White background at the exact pixels your form asks for, kept under a KB limit."}
            </p>
            {output === "jpg" && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {SIZE_PRESETS.map((p) => (
                    <Button
                      key={p.label}
                      type="button"
                      size="sm"
                      variant={width === String(p.w) && height === String(p.h) && maxKB === String(p.kb) ? "default" : "outline"}
                      onClick={() => {
                        setWidth(String(p.w));
                        setHeight(String(p.h));
                        setMaxKB(String(p.kb));
                      }}
                    >
                      {p.label}
                    </Button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="out-w">Width (px)</Label>
                    <Input id="out-w" className="mt-2" type="number" inputMode="numeric" min={20} value={width} onChange={(e) => setWidth(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="out-h">Height (px)</Label>
                    <Input id="out-h" className="mt-2" type="number" inputMode="numeric" min={20} value={height} onChange={(e) => setHeight(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="out-kb">Maximum size (KB)</Label>
                  <Input id="out-kb" className="mt-2" type="number" inputMode="decimal" min={1} placeholder="No limit" value={maxKB} onChange={(e) => setMaxKB(e.target.value)} />
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
