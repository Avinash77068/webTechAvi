import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { CsvEditorTool } from "@/features/csv-editor";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("csv-editor")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDescription,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function CsvEditorPage() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <section aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-xl font-semibold">
            How to edit a CSV file
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Open a CSV file, or edit the starter table.</li>
            <li>Edit cells and add or remove rows and columns.</li>
            <li>Click &quot;Download CSV&quot; to save the result.</li>
          </ol>
        </section>
      }
    >
      <CsvEditorTool />
    </ToolPageLayout>
  );
}
