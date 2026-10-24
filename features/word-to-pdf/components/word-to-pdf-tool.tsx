"use client";

import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ErrorBanner } from "@/components/tools/error-banner";
import { ProcessingProgress } from "@/components/tools/processing-progress";
import { ResultActions } from "@/components/tools/result-actions";
import { downloadBlob } from "@/lib/download";
import { formatBytes } from "@/lib/validation";
import { getToolBySlug } from "@/lib/tools-registry";
import { useWordToPdf } from "../hooks/use-word-to-pdf";
import { DOCX_EXTENSIONS, DOCX_MIME } from "../constants";

const tool = getToolBySlug("word-to-pdf")!;

export function WordToPdfTool() {
  const converter = useWordToPdf();

  if (converter.resultBlob) {
    const blob = converter.resultBlob;
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="size-6" aria-hidden="true" />
          </span>
          <div>
            <p className="font-medium">Your PDF is ready</p>
            <p className="text-sm text-muted-foreground">{formatBytes(blob.size)}</p>
          </div>
        </div>
        {converter.warnings.length > 0 && <ErrorBanner title="Heads up" messages={converter.warnings} />}
        <ResultActions
          downloadLabel="Download PDF"
          onDownload={() => downloadBlob(blob, converter.outputName)}
          onReset={converter.reset}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <FileDropzone
        accept={`${DOCX_MIME},.docx`}
        acceptedMimeTypes={[DOCX_MIME]}
        acceptedExtensions={DOCX_EXTENSIONS}
        acceptedFormatsLabel="DOCX"
        maxSizeMB={tool.maxFileSizeMB}
        disabled={converter.isProcessing}
        onFilesAccepted={(files) => files[0] && converter.selectFile(files[0])}
        onFilesRejected={converter.setErrors}
      />

      <ErrorBanner messages={converter.errors} />

      {converter.file && (
        <>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
            <FileText className="size-8 shrink-0 text-primary" aria-hidden="true" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{converter.file.name}</p>
              <p className="text-xs text-muted-foreground">{formatBytes(converter.file.size)}</p>
            </div>
          </div>
          {converter.isProcessing && <ProcessingProgress label="Converting to PDF…" />}
          <Button type="button" onClick={converter.convert} disabled={converter.isProcessing}>
            {converter.isProcessing ? "Converting…" : "Convert to PDF"}
          </Button>
        </>
      )}
    </div>
  );
}
