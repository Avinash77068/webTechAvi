export type SniffedImageType = "jpeg" | "png" | "webp" | "bmp" | "gif" | null;

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / 1024 ** exponent;
  return `${exponent === 0 ? value : value.toFixed(value < 10 ? 2 : 1)} ${units[exponent]}`;
}

/** Reads the first bytes of a file and identifies its real image type from its signature. */
export async function sniffImageType(file: File | Blob): Promise<SniffedImageType> {
  const buffer = await file.slice(0, 16).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpeg";

  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  )
    return "png";

  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  )
    return "webp";

  if (bytes[0] === 0x42 && bytes[1] === 0x4d) return "bmp";

  if (
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46
  )
    return "gif";

  return null;
}

/** Checks the "%PDF-" signature so a mislabeled or renamed file is caught before processing. */
export async function sniffIsPdf(file: File | Blob): Promise<boolean> {
  const buffer = await file.slice(0, 5).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const header = String.fromCharCode(...bytes);
  return header === "%PDF-";
}

export interface FileValidationOptions {
  /** e.g. ["image/jpeg", "image/png", "image/webp"] */
  acceptedMimeTypes?: string[];
  /** e.g. [".pdf"] */
  acceptedExtensions?: string[];
  maxSizeMB: number;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFileBasics(
  file: File,
  { acceptedMimeTypes, acceptedExtensions, maxSizeMB }: FileValidationOptions
): FileValidationResult {
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size === 0) {
    return { valid: false, error: `"${file.name}" is empty.` };
  }
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `"${file.name}" is ${formatBytes(file.size)}, which is over the ${maxSizeMB} MB limit.`,
    };
  }

  if (acceptedExtensions && acceptedExtensions.length > 0) {
    const lowerName = file.name.toLowerCase();
    const matchesExtension = acceptedExtensions.some((ext) =>
      lowerName.endsWith(ext.toLowerCase())
    );
    if (!matchesExtension) {
      return {
        valid: false,
        error: `"${file.name}" doesn't look like a supported file (expected ${acceptedExtensions.join(", ")}).`,
      };
    }
  }

  if (acceptedMimeTypes && acceptedMimeTypes.length > 0 && file.type) {
    if (!acceptedMimeTypes.includes(file.type)) {
      return {
        valid: false,
        error: `"${file.name}" has an unsupported type (${file.type || "unknown"}).`,
      };
    }
  }

  return { valid: true };
}

const COMBINING_DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");

export function sanitizeFilename(name: string): string {
  const cleaned = name
    .normalize("NFKD")
    .replace(COMBINING_DIACRITICS, "")
    .replace(/[^a-zA-Z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleaned || "download";
}

export function stripExtension(filename: string): string {
  const idx = filename.lastIndexOf(".");
  return idx > 0 ? filename.slice(0, idx) : filename;
}
