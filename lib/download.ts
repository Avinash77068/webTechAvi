import { sanitizeFilename } from "@/lib/validation";

/** Triggers a browser download for a Blob and revokes the object URL afterwards. */
export function downloadBlob(blob: Blob, filename: string): void {
  const safeName = sanitizeFilename(filename);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = safeName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
