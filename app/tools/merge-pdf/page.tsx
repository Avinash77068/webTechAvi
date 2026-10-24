import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { MergePdfTool } from "@/features/merge-pdf";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("merge-pdf")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDescription,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function MergePdfPage() {
  return (
    <ToolPageLayout
      hero
      tool={tool}
      instructions={
        <section aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-xl font-semibold">
            How to merge PDF files
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Upload two or more PDF files.</li>
            <li>Reorder them with the up/down arrows — this sets the order in the final PDF.</li>
            <li>Click "Merge" and download the combined PDF.</li>
          </ol>
        </section>
      }
    >
      <MergePdfTool />
    </ToolPageLayout>
  );
}
