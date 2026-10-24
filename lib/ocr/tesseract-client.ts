export type OcrLanguage = "eng" | "hin";

export const ocrLanguages: { code: OcrLanguage; label: string }[] = [
  { code: "eng", label: "English" },
  { code: "hin", label: "Hindi" },
];

export interface OcrProgress {
  status: string;
  progress: number;
}

/** Runs OCR fully in the browser via Tesseract.js, loaded on demand. Abortable mid-run. */
export async function recognizeImageText(
  file: File | Blob,
  language: OcrLanguage,
  onProgress?: (progress: OcrProgress) => void,
  signal?: AbortSignal
): Promise<string> {
  const { createWorker } = await import("tesseract.js");

  const worker = await createWorker(language, 1, {
    logger: (message) => {
      onProgress?.({ status: message.status, progress: message.progress });
    },
  });

  try {
    const recognizePromise = worker.recognize(file);

    if (!signal) {
      const { data } = await recognizePromise;
      return data.text;
    }

    if (signal.aborted) throw new DOMException("OCR cancelled", "AbortError");

    const abortPromise = new Promise<never>((_, reject) => {
      signal.addEventListener(
        "abort",
        () => reject(new DOMException("OCR cancelled", "AbortError")),
        { once: true }
      );
    });

    const { data } = await Promise.race([recognizePromise, abortPromise]);
    return data.text;
  } finally {
    await worker.terminate().catch(() => {});
  }
}
