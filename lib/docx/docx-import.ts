import { parseHtmlToBlocks, type DocumentBlock } from "@/lib/docx/document-blocks";

/** Reads a .docx file into blocks. Images, tables and complex layout are not carried over. */
export async function docxFileToBlocks(file: File): Promise<DocumentBlock[]> {
  const mammoth = await import("mammoth");
  try {
    const { value } = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
    return parseHtmlToBlocks(value);
  } catch {
    throw new Error("This DOCX file couldn't be read. It may be corrupted or password-protected.");
  }
}
