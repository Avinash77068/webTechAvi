import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { WordToPdfTool } from "@/features/word-to-pdf";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("word-to-pdf")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDescription,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function WordToPdfPage() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <section aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-xl font-semibold">
            How to convert Word to PDF
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Upload a DOCX file.</li>
            <li>Click &quot;Convert to PDF&quot;.</li>
            <li>Download your PDF.</li>
          </ol>
        </section>
      }
    >
      <WordToPdfTool />
    </ToolPageLayout>
  );
}
