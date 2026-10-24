"use client";

import { useMemo, useState } from "react";
import { copyTextToClipboard, downloadBlob } from "@/lib/download";
import { stripExtension } from "@/lib/validation";
import { countMatches, countWords } from "../utils";

export function useTxtEditor() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("document");
  const [findTerm, setFindTerm] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const stats = useMemo(
    () => ({
      characters: text.length,
      words: countWords(text),
      lines: text ? text.split("\n").length : 0,
      matches: countMatches(text, findTerm),
    }),
    [text, findTerm],
  );

  async function openFile(file: File) {
    setErrors([]);
    try {
      setText(await file.text());
      setFileName(stripExtension(file.name));
    } catch {
      setErrors(["Couldn't read this file."]);
    }
  }

  function replaceAll() {
    if (!findTerm) return;
    setText((current) => current.split(findTerm).join(replaceTerm));
  }

  async function copy() {
    const ok = await copyTextToClipboard(text);
    setCopied(ok);
    if (ok) setTimeout(() => setCopied(false), 1500);
    else setErrors(["Couldn't copy to the clipboard."]);
  }

  function download() {
    downloadBlob(new Blob([text], { type: "text/plain;charset=utf-8" }), `${fileName || "document"}.txt`);
  }

  function clear() {
    setText("");
    setFileName("document");
    setErrors([]);
  }

  return {
    text,
    setText,
    fileName,
    setFileName,
    findTerm,
    setFindTerm,
    replaceTerm,
    setReplaceTerm,
    stats,
    copied,
    errors,
    setErrors,
    openFile,
    replaceAll,
    copy,
    download,
    clear,
  };
}
