export type CsvDelimiter = "," | ";" | "\t";

const DELIMITERS: CsvDelimiter[] = [",", ";", "\t"];

/** Picks the delimiter that appears most often in the first line. */
export function detectDelimiter(text: string): CsvDelimiter {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? "";
  let best: CsvDelimiter = ",";
  let bestCount = 0;
  for (const delimiter of DELIMITERS) {
    const count = firstLine.split(delimiter).length - 1;
    if (count > bestCount) {
      best = delimiter;
      bestCount = count;
    }
  }
  return best;
}

/** Parses CSV text (RFC 4180 quoting) into rows padded to the same width. */
export function parseCsv(input: string, delimiter: CsvDelimiter): string[][] {
  const text = input.replace(/^﻿/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === delimiter) {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const width = rows.reduce((max, r) => Math.max(max, r.length), 0);
  return rows.map((r) => [...r, ...Array<string>(width - r.length).fill("")]);
}

function escapeField(value: string, delimiter: CsvDelimiter): string {
  return value.includes(delimiter) || /["\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function serializeCsv(rows: string[][], delimiter: CsvDelimiter): string {
  return rows.map((row) => row.map((value) => escapeField(value, delimiter)).join(delimiter)).join("\r\n");
}
