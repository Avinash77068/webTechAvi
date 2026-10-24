"use client";

import { Columns3, Download, Plus, RotateCcw, Rows3, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileDropzone } from "@/components/tools/file-dropzone";
import { ErrorBanner } from "@/components/tools/error-banner";
import { getToolBySlug } from "@/lib/tools-registry";
import { useCsvEditor } from "../hooks/use-csv-editor";
import { CSV_ACCEPT, CSV_EXTENSIONS, CSV_MIME_TYPES, DELIMITER_OPTIONS } from "../constants";

const tool = getToolBySlug("csv-editor")!;

export function CsvEditorTool() {
  const editor = useCsvEditor();

  return (
    <div className="space-y-5">
      <FileDropzone
        accept={CSV_ACCEPT}
        acceptedMimeTypes={CSV_MIME_TYPES}
        acceptedExtensions={CSV_EXTENSIONS}
        acceptedFormatsLabel="CSV (optional — or edit the table below)"
        maxSizeMB={tool.maxFileSizeMB}
        onFilesAccepted={(files) => files[0] && editor.openFile(files[0])}
        onFilesRejected={editor.setErrors}
      />

      <ErrorBanner messages={editor.errors} />

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="w-10 border-b border-border p-1" />
              {editor.rows[0]?.map((_, columnIndex) => (
                <th key={columnIndex} className="border-b border-l border-border p-1 text-left font-normal">
                  <Button
                    type="button"
                    size="xs"
                    variant="ghost"
                    aria-label={`Remove column ${columnIndex + 1}`}
                    disabled={editor.columnCount <= 1}
                    onClick={() => editor.removeColumn(columnIndex)}
                  >
                    <X aria-hidden="true" />
                    Column {columnIndex + 1}
                  </Button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {editor.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex === 0 ? "bg-primary/5 font-semibold" : undefined}>
                <td className="border-b border-border p-1 text-center">
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="ghost"
                    aria-label={`Remove row ${rowIndex + 1}`}
                    disabled={editor.rows.length <= 1}
                    onClick={() => editor.removeRow(rowIndex)}
                  >
                    <X aria-hidden="true" />
                  </Button>
                </td>
                {row.map((cell, columnIndex) => (
                  <td key={columnIndex} className="border-b border-l border-border p-0">
                    <input
                      value={cell}
                      onChange={(event) => editor.updateCell(rowIndex, columnIndex, event.target.value)}
                      aria-label={`Row ${rowIndex + 1}, column ${columnIndex + 1}`}
                      className="w-full min-w-32 bg-transparent px-2 py-1.5 outline-none focus:bg-accent/50"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">The first row is treated as the header row.</p>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={editor.addRow}>
          <Rows3 aria-hidden="true" />
          <Plus aria-hidden="true" />
          Add row
        </Button>
        <Button type="button" variant="outline" onClick={editor.addColumn}>
          <Columns3 aria-hidden="true" />
          <Plus aria-hidden="true" />
          Add column
        </Button>
        <Button type="button" variant="outline" onClick={editor.reset}>
          <RotateCcw aria-hidden="true" />
          Reset
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="csv-file-name">File name</Label>
          <Input id="csv-file-name" value={editor.fileName} onChange={(event) => editor.setFileName(event.target.value)} className="w-56" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="csv-delimiter">Delimiter</Label>
          <select
            id="csv-delimiter"
            value={editor.delimiter}
            onChange={(event) => editor.setDelimiter(event.target.value as typeof editor.delimiter)}
            className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"
          >
            {DELIMITER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <Button type="button" onClick={editor.download}>
          <Download aria-hidden="true" />
          Download CSV
        </Button>
      </div>
    </div>
  );
}
