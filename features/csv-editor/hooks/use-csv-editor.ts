"use client";

import { useState } from "react";
import { detectDelimiter, parseCsv, serializeCsv, type CsvDelimiter } from "@/lib/csv/csv";
import { downloadBlob } from "@/lib/download";
import { stripExtension } from "@/lib/validation";
import { EMPTY_TABLE, MAX_ROWS } from "../constants";

export function useCsvEditor() {
  const [rows, setRows] = useState<string[][]>(EMPTY_TABLE);
  const [delimiter, setDelimiter] = useState<CsvDelimiter>(",");
  const [fileName, setFileName] = useState("data");
  const [errors, setErrors] = useState<string[]>([]);

  const columnCount = rows[0]?.length ?? 0;

  async function openFile(file: File) {
    setErrors([]);
    const text = await file.text();
    const detected = detectDelimiter(text);
    const parsed = parseCsv(text, detected);
    if (parsed.length === 0) {
      setErrors(["This CSV file is empty."]);
      return;
    }
    if (parsed.length > MAX_ROWS) {
      setErrors([`This file has ${parsed.length} rows. The editor supports up to ${MAX_ROWS} rows.`]);
      return;
    }
    setRows(parsed);
    setDelimiter(detected);
    setFileName(stripExtension(file.name));
  }

  function updateCell(rowIndex: number, columnIndex: number, value: string) {
    setRows((prev) =>
      prev.map((row, r) => (r === rowIndex ? row.map((cell, c) => (c === columnIndex ? value : cell)) : row)),
    );
  }

  function addRow() {
    setRows((prev) => [...prev, Array<string>(prev[0]?.length ?? 1).fill("")]);
  }

  function removeRow(rowIndex: number) {
    setRows((prev) => (prev.length > 1 ? prev.filter((_, r) => r !== rowIndex) : prev));
  }

  function addColumn() {
    setRows((prev) => prev.map((row, r) => [...row, r === 0 ? `Column ${row.length + 1}` : ""]));
  }

  function removeColumn(columnIndex: number) {
    setRows((prev) => (prev[0] && prev[0].length > 1 ? prev.map((row) => row.filter((_, c) => c !== columnIndex)) : prev));
  }

  function download() {
    downloadBlob(new Blob([serializeCsv(rows, delimiter)], { type: "text/csv;charset=utf-8" }), `${fileName || "data"}.csv`);
  }

  function reset() {
    setRows(EMPTY_TABLE);
    setDelimiter(",");
    setFileName("data");
    setErrors([]);
  }

  return {
    rows,
    columnCount,
    delimiter,
    setDelimiter,
    fileName,
    setFileName,
    errors,
    setErrors,
    openFile,
    updateCell,
    addRow,
    removeRow,
    addColumn,
    removeColumn,
    download,
    reset,
  };
}
