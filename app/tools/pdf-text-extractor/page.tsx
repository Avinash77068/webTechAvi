import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { PdfTextExtractorTool } from "./pdf-text-extractor-tool";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("pdf-text-extractor")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDescription,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function PdfTextExtractorPage() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <section aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-xl font-semibold">
            How to extract text from a PDF
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Upload a PDF and select the pages you want text from.</li>
            <li>Pick an OCR language, used only as a fallback for pages without embedded text.</li>
            <li>Click "Extract text" — each page is labeled as embedded text or OCR.</li>
            <li>Edit the result if needed, then copy or download it.</li>
          </ol>
        </section>
      }
    >
      <PdfTextExtractorTool />
    </ToolPageLayout>
  );
}
