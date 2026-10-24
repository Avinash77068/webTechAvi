"use client";

import { useEffect } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ErrorBanner } from "@/components/tools/error-banner";
import { ProcessingProgress } from "@/components/tools/processing-progress";
import { ResultActions } from "@/components/tools/result-actions";
import { getToolBySlug } from "@/lib/tools-registry";
import { usePdfEditor } from "../hooks/use-pdf-editor";
import { IMAGE_ACCEPT } from "../constants";
import { describeOverlay } from "../utils";
import { EditorToolbar } from "./editor-toolbar";
import { PageCanvas } from "./page-canvas";
import { PropertiesPanel } from "./properties-panel";
import { SignaturePad } from "./signature-pad";

const tool = getToolBySlug("pdf-editor")!;

function isTypingTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
}

export function PdfEditorTool() {
  const { imageInputRef, ...editor } = usePdfEditor();
  const { pages, overlayState } = editor;
  const { overlays, selected, selectedId, remove, undo, redo } = overlayState;
  const hasFile = !!pages.file && !editor.resultBlob;

  useEffect(() => {
    if (!hasFile) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target)) return;
      const modifier = event.metaKey || event.ctrlKey;
      if (modifier && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      } else if ((event.key === "Delete" || event.key === "Backspace") && selectedId) {
        event.preventDefault();
        remove(selectedId);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasFile, selectedId, remove, undo, redo]);

  if (editor.resultBlob && pages.file) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="size-6" aria-hidden="true" />
          </span>
          <div>
            <p className="font-medium">Your PDF is ready</p>
            <p className="text-sm text-muted-foreground">
              {overlays.length} edit{overlays.length === 1 ? "" : "s"} added across {pages.pageCount} page{pages.pageCount === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        {editor.warnings.length > 0 && <ErrorBanner title="Heads up" messages={editor.warnings} />}
        <ResultActions
          downloadLabel="Download PDF"
          onDownload={editor.download}
          onReset={editor.reset}
          extra={
            <Button type="button" variant="outline" onClick={editor.backToEditing}>
              Keep editing
            </Button>
          }
        />
      </div>
    );
  }

  if (!pages.file) {
    return (
      <div className="space-y-4">
        <FileDropzone
          accept="application/pdf"
          acceptedMimeTypes={["application/pdf"]}
          acceptedExtensions={[".pdf"]}
          acceptedFormatsLabel="PDF"
          maxSizeMB={tool.maxFileSizeMB}
          disabled={pages.isLoading}
          onFilesAccepted={(files) => files[0] && pages.open(files[0])}
          onFilesRejected={pages.setErrors}
        />
        <ErrorBanner messages={editor.errors} />
        {pages.isLoading && <ProcessingProgress label="Loading PDF…" />}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <EditorToolbar
        tool={editor.tool}
        onToolChange={editor.chooseTool}
        canUndo={overlayState.canUndo}
        canRedo={overlayState.canRedo}
        onUndo={undo}
        onRedo={redo}
        zoom={editor.zoom}
        canZoomIn={editor.canZoomIn}
        canZoomOut={editor.canZoomOut}
        onZoomIn={editor.zoomIn}
        onZoomOut={editor.zoomOut}
        currentPage={pages.currentPage}
        pageCount={pages.pageCount}
        onPageChange={pages.goToPage}
      />

      <ErrorBanner messages={editor.errors} />

      <PageCanvas
        imageUrl={pages.pageImageUrl}
        pageNumber={pages.currentPage}
        pageSize={pages.pageSize}
        zoom={editor.zoom}
        tool={editor.tool}
        overlays={overlays.filter((o) => o.pageIndex === pages.currentPage - 1)}
        selectedId={selectedId}
        onPageClick={editor.handlePageClick}
        onSelect={overlayState.select}
        onBeginChange={overlayState.beginChange}
        onChange={overlayState.update}
      />

      {selected && (
        <PropertiesPanel
          overlay={selected}
          onBeginChange={overlayState.beginChange}
          onChange={(updater) => overlayState.update(selected.id, updater)}
          onRemove={() => remove(selected.id)}
        />
      )}

      {overlays.length > 0 && (
        <ul className="space-y-1.5" aria-label="All edits">
          {overlays.map((overlay) => (
            <li key={overlay.id}>
              <button
                type="button"
                onClick={() => {
                  pages.goToPage(overlay.pageIndex + 1);
                  overlayState.select(overlay.id);
                }}
                className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm hover:bg-accent ${
                  overlay.id === selectedId ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                <span className="truncate">{describeOverlay(overlay)}</span>
                <span className="shrink-0 text-xs text-muted-foreground">Page {overlay.pageIndex + 1}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {editor.isExporting && <ProcessingProgress label="Exporting PDF…" />}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={editor.exportPdf} disabled={editor.isExporting || overlays.length === 0}>
          {editor.isExporting ? "Exporting…" : "Export PDF"}
        </Button>
        <Button type="button" variant="outline" onClick={editor.reset}>
          Choose a different PDF
        </Button>
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) editor.chooseImage(file);
        }}
      />

      <Dialog open={editor.signatureDialogOpen} onOpenChange={(open) => !open && editor.cancelSignature()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Draw your signature</DialogTitle>
          </DialogHeader>
          <SignaturePad onSave={editor.saveSignature} onCancel={editor.cancelSignature} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
