import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { PdfEditorTool } from "@/features/pdf-editor";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("pdf-editor")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDescription,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function PdfEditorPage() {
  return (
    <ToolPageLayout
      hero
      tool={tool}
      instructions={
        <section aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-xl font-semibold">
            How to edit and sign a PDF
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Upload a PDF and go to the page you want to edit.</li>
            <li>Pick Text, Signature, Image, Highlight or Cover, then click on the page to place it.</li>
            <li>Select an item to drag it, resize it, or change its text, size and color.</li>
            <li>Click "Export PDF" and download the result.</li>
          </ol>
        </section>
      }
    >
      <PdfEditorTool />
    </ToolPageLayout>
  );
}
