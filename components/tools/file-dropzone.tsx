"use client";

import { useCallback, useId, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateFileBasics } from "@/lib/validation";

export interface FileDropzoneProps {
  /** HTML `accept` attribute, e.g. "image/jpeg,image/png,image/webp" */
  accept: string;
  acceptedExtensions?: string[];
  acceptedMimeTypes?: string[];
  acceptedFormatsLabel: string;
  maxSizeMB: number;
  multiple?: boolean;
  disabled?: boolean;
  onFilesAccepted: (files: File[]) => void;
  onFilesRejected?: (errors: string[]) => void;
  className?: string;
}

export function FileDropzone({
  accept,
  acceptedExtensions,
  acceptedMimeTypes,
  acceptedFormatsLabel,
  maxSizeMB,
  multiple = false,
  disabled = false,
  onFilesAccepted,
  onFilesRejected,
  className,
}: FileDropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const processFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      const files = Array.from(fileList);
      const accepted: File[] = [];
      const errors: string[] = [];

      for (const file of files) {
        const result = validateFileBasics(file, {
          acceptedExtensions,
          acceptedMimeTypes,
          maxSizeMB,
        });
        if (result.valid) accepted.push(file);
        else if (result.error) errors.push(result.error);
      }

      if (errors.length > 0) onFilesRejected?.(errors);
      if (accepted.length > 0) onFilesAccepted(multiple ? accepted : [accepted[0]]);
    },
    [acceptedExtensions, acceptedMimeTypes, maxSizeMB, multiple, onFilesAccepted, onFilesRejected]
  );

  function openPicker() {
    if (!disabled) inputRef.current?.click();
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-describedby={`${inputId}-hint`}
      onClick={openPicker}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openPicker();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (!disabled) processFiles(e.dataTransfer.files);
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-muted/30 px-6 py-12 text-center transition-colors outline-none",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        isDragOver && "border-primary bg-accent",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <UploadCloud className="size-6" aria-hidden="true" />
      </span>
      <div>
        <p className="font-medium">
          Drag &amp; drop {multiple ? "files" : "a file"} here, or{" "}
          <span className="text-primary underline underline-offset-2">browse</span>
        </p>
        <p id={`${inputId}-hint`} className="mt-1 text-sm text-muted-foreground">
          Supports {acceptedFormatsLabel} &middot; up to {maxSizeMB} MB each
        </p>
      </div>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          processFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
