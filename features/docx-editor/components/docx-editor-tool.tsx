"use client";

import { Download, FilePlus2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ErrorBanner } from "@/components/tools/error-banner";
import { getToolBySlug } from "@/lib/tools-registry";
import { useDocxEditor } from "../hooks/use-docx-editor";
import { DOCX_EXTENSIONS, DOCX_MIME, EDITOR_CONTENT_CLASS, EDITOR_PLACEHOLDER_HTML } from "../constants";
import { EditorToolbar } from "./editor-toolbar";

const tool = getToolBySlug("docx-editor")!;

export function DocxEditorTool() {
  const { editorRef, ...editor } = useDocxEditor();

  return (
    <div className="space-y-5">
      <FileDropzone
        accept={`${DOCX_MIME},.docx`}
        acceptedMimeTypes={[DOCX_MIME]}
        acceptedExtensions={DOCX_EXTENSIONS}
        acceptedFormatsLabel="DOCX (optional — or start writing below)"
        maxSizeMB={tool.maxFileSizeMB}
        disabled={editor.isBusy}
        onFilesAccepted={(files) => files[0] && editor.importFile(files[0])}
        onFilesRejected={editor.setErrors}
      />

      <ErrorBanner messages={editor.errors} />

      <EditorToolbar onCommand={editor.runCommand} onBlockType={editor.setBlockType} />

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="Document editor"
        className={EDITOR_CONTENT_CLASS}
        dangerouslySetInnerHTML={{ __html: EDITOR_PLACEHOLDER_HTML }}
      />

      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="docx-file-name">File name</Label>
          <Input id="docx-file-name" value={editor.fileName} onChange={(event) => editor.setFileName(event.target.value)} className="w-56" />
        </div>
        <Button type="button" onClick={editor.exportDocx} disabled={editor.isBusy}>
          <Download aria-hidden="true" />
          Download DOCX
        </Button>
        <Button type="button" variant="outline" onClick={editor.clear} disabled={editor.isBusy}>
          <Trash2 aria-hidden="true" />
          Clear
        </Button>
      </div>
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <FilePlus2 className="size-3.5" aria-hidden="true" />
        Opening a DOCX keeps text, headings, lists, bold, italic and underline. Images and tables aren&apos;t carried over.
      </p>
    </div>
  );
}
