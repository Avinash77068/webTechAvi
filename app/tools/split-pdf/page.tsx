import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { SplitPdfTool } from "@/features/split-pdf";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("split-pdf")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDescription,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function SplitPdfPage() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <section aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-xl font-semibold">
            How to split a PDF
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Upload a PDF — every page loads as a thumbnail.</li>
            <li>Click the pages you want to keep (all are selected by default).</li>
            <li>Choose "One PDF" or "Separate files (ZIP)" as the export mode.</li>
            <li>Click "Export" and download the result.</li>
          </ol>
        </section>
      }
    >
      <SplitPdfTool />
    </ToolPageLayout>
  );
}
