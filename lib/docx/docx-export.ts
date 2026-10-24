import type { DocumentBlock } from "@/lib/docx/document-blocks";

const ORDERED_LIST = "ordered-list";

/** Builds a real .docx file from blocks. The docx library is loaded only when exporting. */
export async function blocksToDocxBlob(blocks: DocumentBlock[]): Promise<Blob> {
  const { AlignmentType, Document, HeadingLevel, LevelFormat, Packer, Paragraph, TextRun } = await import("docx");

  const alignments = {
    left: AlignmentType.LEFT,
    center: AlignmentType.CENTER,
    right: AlignmentType.RIGHT,
    justify: AlignmentType.JUSTIFIED,
  } as const;
  const headings = [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3];

  const paragraphs = blocks.map((block) => {
    const children = block.runs.flatMap((run) =>
      run.text.split("\n").map(
        (text, index) =>
          new TextRun({
            text,
            bold: run.bold,
            italics: run.italic,
            underline: run.underline ? {} : undefined,
            break: index > 0 ? 1 : undefined,
          }),
      ),
    );
    return new Paragraph({
      children,
      alignment: alignments[block.align],
      heading: block.kind === "heading" ? headings[(block.level ?? 1) - 1] : undefined,
      bullet: block.kind === "list-item" && !block.ordered ? { level: 0 } : undefined,
      numbering:
        block.kind === "list-item" && block.ordered ? { reference: ORDERED_LIST, level: 0 } : undefined,
    });
  });

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: ORDERED_LIST,
          levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT }],
        },
      ],
    },
    sections: [{ children: paragraphs }],
  });
  return Packer.toBlob(doc);
}
