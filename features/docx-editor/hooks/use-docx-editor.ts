"use client";

import { useCallback, useRef, useState } from "react";
import { blocksToHtml, parseHtmlToBlocks } from "@/lib/docx/document-blocks";
import { blocksToDocxBlob } from "@/lib/docx/docx-export";
import { docxFileToBlocks } from "@/lib/docx/docx-import";
import { downloadBlob } from "@/lib/download";
import { stripExtension } from "@/lib/validation";
import { EDITOR_PLACEHOLDER_HTML } from "../constants";

export type EditorCommand =
  | "bold"
  | "italic"
  | "underline"
  | "insertUnorderedList"
  | "insertOrderedList"
  | "justifyLeft"
  | "justifyCenter"
  | "justifyRight"
  | "undo"
  | "redo";

export function useDocxEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [fileName, setFileName] = useState("document");
  const [isBusy, setIsBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const runCommand = useCallback((command: EditorCommand) => {
    editorRef.current?.focus();
    document.execCommand(command);
  }, []);

  const setBlockType = useCallback((tag: "H1" | "H2" | "P") => {
    editorRef.current?.focus();
    document.execCommand("formatBlock", false, tag);
  }, []);

  async function importFile(file: File) {
    setErrors([]);
    setIsBusy(true);
    try {
      const blocks = await docxFileToBlocks(file);
      if (editorRef.current) {
        editorRef.current.innerHTML = blocks.length ? blocksToHtml(blocks) : EDITOR_PLACEHOLDER_HTML;
      }
      setFileName(stripExtension(file.name));
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Couldn't open this file."]);
    } finally {
      setIsBusy(false);
    }
  }

  async function exportDocx() {
    const blocks = parseHtmlToBlocks(editorRef.current?.innerHTML ?? "");
    if (blocks.length === 0) {
      setErrors(["Write something before exporting."]);
      return;
    }
    setErrors([]);
    setIsBusy(true);
    try {
      downloadBlob(await blocksToDocxBlob(blocks), `${fileName || "document"}.docx`);
    } catch {
      setErrors(["Couldn't create the DOCX file. Please try again."]);
    } finally {
      setIsBusy(false);
    }
  }

  function clear() {
    if (editorRef.current) editorRef.current.innerHTML = EDITOR_PLACEHOLDER_HTML;
    setFileName("document");
    setErrors([]);
  }

  return { editorRef, fileName, setFileName, isBusy, errors, setErrors, runCommand, setBlockType, importFile, exportDocx, clear };
}
