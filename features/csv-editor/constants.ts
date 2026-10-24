import type { CsvDelimiter } from "@/lib/csv/csv";

export const CSV_ACCEPT = "text/csv,application/vnd.ms-excel,.csv";
export const CSV_MIME_TYPES = ["text/csv", "application/vnd.ms-excel", "text/plain"];
export const CSV_EXTENSIONS = [".csv"];

export const MAX_ROWS = 5000;

export const DELIMITER_OPTIONS: { value: CsvDelimiter; label: string }[] = [
  { value: ",", label: "Comma" },
  { value: ";", label: "Semicolon" },
  { value: "\t", label: "Tab" },
];

export const EMPTY_TABLE: string[][] = [
  ["Column 1", "Column 2", "Column 3"],
  ["", "", ""],
];
