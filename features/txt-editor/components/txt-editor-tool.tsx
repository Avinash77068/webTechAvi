"use client";

import { Check, Copy, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ErrorBanner } from "@/components/tools/error-banner";
import { getToolBySlug } from "@/lib/tools-registry";
import { useTxtEditor } from "../hooks/use-txt-editor";
import { TXT_ACCEPT, TXT_EXTENSIONS, TXT_MIME_TYPES } from "../constants";

const tool = getToolBySlug("txt-editor")!;

export function TxtEditorTool() {
  const editor = useTxtEditor();

  return (
    <div className="space-y-5">
      <FileDropzone
        accept={TXT_ACCEPT}
        acceptedMimeTypes={TXT_MIME_TYPES}
        acceptedExtensions={TXT_EXTENSIONS}
        acceptedFormatsLabel="TXT (optional — or type below)"
        maxSizeMB={tool.maxFileSizeMB}
        onFilesAccepted={(files) => files[0] && editor.openFile(files[0])}
        onFilesRejected={editor.setErrors}
      />

      <ErrorBanner messages={editor.errors} />

      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <div className="space-y-1.5">
          <Label htmlFor="txt-find">Find</Label>
          <Input id="txt-find" value={editor.findTerm} onChange={(event) => editor.setFindTerm(event.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="txt-replace">Replace with</Label>
          <Input id="txt-replace" value={editor.replaceTerm} onChange={(event) => editor.setReplaceTerm(event.target.value)} />
        </div>
        <Button type="button" variant="outline" className="self-end" onClick={editor.replaceAll} disabled={!editor.findTerm || editor.stats.matches === 0}>
          Replace all{editor.findTerm ? ` (${editor.stats.matches})` : ""}
        </Button>
      </div>

      <Textarea
        value={editor.text}
        onChange={(event) => editor.setText(event.target.value)}
        placeholder="Type or paste your text here…"
        aria-label="Text editor"
        className="min-h-80 font-mono text-sm"
      />

      <p className="text-sm text-muted-foreground">
        {editor.stats.characters} characters · {editor.stats.words} words · {editor.stats.lines} lines
      </p>

      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="txt-file-name">File name</Label>
          <Input id="txt-file-name" value={editor.fileName} onChange={(event) => editor.setFileName(event.target.value)} className="w-56" />
        </div>
        <Button type="button" onClick={editor.download} disabled={!editor.text}>
          <Download aria-hidden="true" />
          Download TXT
        </Button>
        <Button type="button" variant="outline" onClick={editor.copy} disabled={!editor.text}>
          {editor.copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          {editor.copied ? "Copied" : "Copy"}
        </Button>
        <Button type="button" variant="outline" onClick={editor.clear} disabled={!editor.text}>
          <Trash2 aria-hidden="true" />
          Clear
        </Button>
      </div>
    </div>
  );
}
