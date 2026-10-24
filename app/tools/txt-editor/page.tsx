import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { TxtEditorTool } from "@/features/txt-editor";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("txt-editor")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDescription,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function TxtEditorPage() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <section aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-xl font-semibold">
            How to use the TXT editor
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Open a TXT file or type or paste your text.</li>
            <li>Use Find and Replace to change text in bulk.</li>
            <li>Download the file, or copy the text to your clipboard.</li>
          </ol>
        </section>
      }
    >
      <TxtEditorTool />
    </ToolPageLayout>
  );
}
