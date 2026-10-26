/**
 * Pure pixel helpers for the photo editor and the signature maker. They work on RGBA
 * `Uint8ClampedArray`s in place (no canvas), so they are easy to test and run in any
 * browser: `ctx.filter` is not used because Safari lacks it.
 */

export interface Adjust {
  /** -100..100 */
  brightness: number;
  /** -100..100 */
  contrast: number;
  /** -100..100 */
  saturation: number;
  grayscale: boolean;
  /** 0..100: pushes light, neutral pixels (a wall, paper) to pure white. 0 = off. */
  whiten: number;
  /** Stretch the tones so the darkest and lightest 1% reach black and white. */
  auto: boolean;
}

export const NO_ADJUST: Adjust = { brightness: 0, contrast: 0, saturation: 0, grayscale: false, whiten: 0, auto: false };

export function isNeutral(a: Adjust): boolean {
  return (
    a.brightness === 0 && a.contrast === 0 && a.saturation === 0 && !a.grayscale && a.whiten === 0 && !a.auto
  );
}

const lum = (r: number, g: number, b: number) => 0.299 * r + 0.587 * g + 0.114 * b;
const smooth = (lo: number, hi: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - lo) / (hi - lo)));
  return t * t * (3 - 2 * t);
};

/** Luminance level below which `share` (0..1) of the opaque pixels fall. */
export function lumPercentile(data: Uint8ClampedArray, share: number): number {
  const hist = new Uint32Array(256);
  let n = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3]! < 16) continue;
    hist[Math.round(lum(data[i]!, data[i + 1]!, data[i + 2]!))]!++;
    n++;
  }
  if (n === 0) return 255;
  const goal = n * share;
  let seen = 0;
  for (let v = 0; v < 256; v++) {
    seen += hist[v]!;
    if (seen >= goal) return v;
  }
  return 255;
}

/** Tone stretch: black point = 1st percentile, white point = 99th. Skipped for flat images. */
export function autoLevels(data: Uint8ClampedArray): void {
  const lo = lumPercentile(data, 0.01);
  const hi = lumPercentile(data, 0.99);
  if (hi - lo < 24) return;
  const k = 255 / (hi - lo);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = (data[i]! - lo) * k;
    data[i + 1] = (data[i + 1]! - lo) * k;
    data[i + 2] = (data[i + 2]! - lo) * k;
  }
}

/** Apply every adjustment in one pass over the pixels. */
export function applyAdjust(data: Uint8ClampedArray, a: Adjust): void {
  if (isNeutral(a)) return;
  if (a.auto) autoLevels(data);
  const add = a.brightness * 2.55;
  const c = a.contrast * 2.55;
  const cf = (259 * (c + 255)) / (255 * (259 - c));
  const sat = 1 + a.saturation / 100;
  const lowT = 215 - a.whiten * 0.5;
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i]! + add;
    let g = data[i + 1]! + add;
    let b = data[i + 2]! + add;
    r = cf * (r - 128) + 128;
    g = cf * (g - 128) + 128;
    b = cf * (b - 128) + 128;
    const l = lum(r, g, b);
    if (a.grayscale) {
      r = g = b = l;
    } else if (a.saturation !== 0) {
      r = l + (r - l) * sat;
      g = l + (g - l) * sat;
      b = l + (b - l) * sat;
    }
    if (a.whiten > 0) {
      // Light and low-colour pixels only, so skin and hair keep their tone.
      const chroma = Math.max(r, g, b) - Math.min(r, g, b);
      const w = smooth(lowT, lowT + 40, lum(r, g, b)) * (1 - smooth(18, 60, chroma));
      r += (255 - r) * w;
      g += (255 - g) * w;
      b += (255 - b) * w;
    }
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }
}

/** '#rrggbb' to [r, g, b]. Falls back to near-black. */
export function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return [17, 24, 39];
  const n = parseInt(m[1]!, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * Photo of a signature on paper to ink on a transparent background. The paper level is the
 * 90th-percentile luminance, so a shadow or a tinted sheet still counts as paper. Every
 * pixel becomes the chosen ink colour; only its opacity follows how dark the pen was.
 * `strength` 0..100: higher removes more of the faint paper texture (and thin pen lines).
 */
export function inkToTransparent(data: Uint8ClampedArray, ink: [number, number, number], strength: number): void {
  const paper = lumPercentile(data, 0.9);
  const lo = paper * 0.4;
  const hi = paper * (0.65 + 0.25 * (strength / 100));
  for (let i = 0; i < data.length; i += 4) {
    const l = lum(data[i]!, data[i + 1]!, data[i + 2]!);
    const alpha = (1 - smooth(lo, hi, l)) * (data[i + 3]! / 255);
    data[i] = ink[0];
    data[i + 1] = ink[1];
    data[i + 2] = ink[2];
    data[i + 3] = alpha * 255;
  }
}

/** Bounding box of pixels with alpha above `min`, or null for an empty image. */
export function inkBounds(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  min = 12,
): { x: number; y: number; w: number; h: number } | null {
  let x0 = w;
  let y0 = h;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3]! > min) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return x1 < 0 ? null : { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}
