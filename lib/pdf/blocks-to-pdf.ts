import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import type { DocumentBlock, TextRun } from "@/lib/docx/document-blocks";
import { hasUnsupportedCharacters, toLatin1 } from "@/lib/pdf/text-encoding";

const PAGE = { width: 595.28, height: 841.89, margin: 56 };
const LIST_INDENT = 18;
const FONT_SIZES = { heading1: 22, heading2: 18, heading3: 15, body: 11 };

interface Word {
  text: string;
  run: TextRun;
}

function toWords(runs: TextRun[]): Word[] {
  const words: Word[] = [];
  for (const run of runs) {
    for (const part of toLatin1(run.text).split(/(\s+)/)) {
      if (part) words.push({ text: part, run });
    }
  }
  return words;
}

/** Renders structured text to a PDF. Fonts, headings, lists and alignment are kept; images and tables are not. */
export async function blocksToPdf(blocks: DocumentBlock[]): Promise<{ bytes: Uint8Array; hadUnsupportedText: boolean }> {
  const pdf = await PDFDocument.create();
  const fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
    italic: await pdf.embedFont(StandardFonts.HelveticaOblique),
    boldItalic: await pdf.embedFont(StandardFonts.HelveticaBoldOblique),
  };
  const pickFont = (run: TextRun, forceBold: boolean): PDFFont => {
    const bold = run.bold || forceBold;
    if (bold && run.italic) return fonts.boldItalic;
    if (bold) return fonts.bold;
    return run.italic ? fonts.italic : fonts.regular;
  };

  let hadUnsupportedText = false;
  let page = pdf.addPage([PAGE.width, PAGE.height]);
  let y = PAGE.height - PAGE.margin;
  const contentWidth = PAGE.width - PAGE.margin * 2;

  function ensureSpace(height: number) {
    if (y - height < PAGE.margin) {
      page = pdf.addPage([PAGE.width, PAGE.height]);
      y = PAGE.height - PAGE.margin;
    }
  }

  let orderedCounter = 0;

  for (const block of blocks) {
    const isHeading = block.kind === "heading";
    const size = isHeading ? FONT_SIZES[`heading${block.level ?? 1}` as "heading1"] : FONT_SIZES.body;
    const lineHeight = size * 1.35;
    const indent = block.kind === "list-item" ? LIST_INDENT : 0;
    const availableWidth = contentWidth - indent;

    let runs = block.runs;
    if (block.kind === "list-item") {
      orderedCounter = block.ordered ? orderedCounter + 1 : 0;
      runs = [{ text: block.ordered ? `${orderedCounter}. ` : "* " }, ...runs];
    } else {
      orderedCounter = 0;
    }
    if (runs.some((run) => hasUnsupportedCharacters(run.text))) {
      hadUnsupportedText = true;
    }

    const words = toWords(runs);
    const lines: Word[][] = [[]];
    let lineWidth = 0;
    for (const word of words) {
      if (word.text === "\n") {
        lines.push([]);
        lineWidth = 0;
        continue;
      }
      const width = pickFont(word.run, isHeading).widthOfTextAtSize(word.text, size);
      const isSpace = /^\s+$/.test(word.text);
      if (!isSpace && lineWidth + width > availableWidth && lines[lines.length - 1].length > 0) {
        lines.push([]);
        lineWidth = 0;
      }
      if (isSpace && lines[lines.length - 1].length === 0) continue;
      lines[lines.length - 1].push(word);
      lineWidth += width;
    }

    y -= isHeading ? size * 0.4 : 0;
    for (const line of lines) {
      ensureSpace(lineHeight);
      y -= lineHeight;
      const width = line.reduce((sum, w) => sum + pickFont(w.run, isHeading).widthOfTextAtSize(w.text, size), 0);
      let x = PAGE.margin + indent;
      if (block.align === "center") x += (availableWidth - width) / 2;
      if (block.align === "right") x += availableWidth - width;
      for (const word of line) {
        const font = pickFont(word.run, isHeading);
        const wordWidth = font.widthOfTextAtSize(word.text, size);
        page.drawText(word.text, { x, y, size, font, color: rgb(0.1, 0.1, 0.1) });
        if (word.run.underline && !/^\s+$/.test(word.text)) {
          page.drawLine({
            start: { x, y: y - 1.5 },
            end: { x: x + wordWidth, y: y - 1.5 },
            thickness: 0.7,
            color: rgb(0.1, 0.1, 0.1),
          });
        }
        x += wordWidth;
      }
    }
    y -= size * (isHeading ? 0.4 : 0.6);
  }

  return { bytes: await pdf.save(), hadUnsupportedText };
}
