import { sanitizeFilename } from "@/lib/validation";

/**
 * Triggers a browser download for a Blob. Mobile browsers (notably Firefox for Android) hand the
 * blob URL to their download manager asynchronously, so the link stays in the DOM and the URL
 * stays valid for a while after the click. Falls back to opening the file when the `download`
 * attribute isn't supported.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const safeName = sanitizeFilename(filename);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.rel = "noopener";
  link.style.display = "none";

  link.download = safeName;
  if (link.download !== safeName) link.target = "_blank";

  document.body.appendChild(link);
  link.click();
  setTimeout(() => link.remove(), 1_000);
  setTimeout(() => URL.revokeObjectURL(url), 120_000);
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
