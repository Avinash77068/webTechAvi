import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { CompressPdfTool } from "./compress-pdf-tool";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("compress-pdf")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDescription,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function CompressPdfPage() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <section aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-xl font-semibold">
            How to compress a PDF
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Upload a PDF.</li>
            <li>Pick a compression level — lower produces a smaller file at lower visual quality.</li>
            <li>Click "Compress PDF" and check the before/after size before downloading.</li>
          </ol>
        </section>
      }
    >
      <CompressPdfTool />
    </ToolPageLayout>
  );
}
