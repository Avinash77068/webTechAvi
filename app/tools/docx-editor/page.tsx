import { createPageMetadata } from "@/lib/page-metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { DocxEditorTool } from "@/features/docx-editor";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("docx-editor")!;

export const metadata = createPageMetadata({
  title: tool.name,
  description: tool.shortDescription,
  path: `/tools/${tool.slug}`,
  keywords: tool.keywords,
});

export default function DocxEditorPage() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <section aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-xl font-semibold">
            How to use the DOCX editor
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Upload a DOCX file, or just start writing in the editor.</li>
            <li>Use the toolbar for headings, bold, italic, underline, lists and alignment.</li>
            <li>Click &quot;Download DOCX&quot; to save your document.</li>
          </ol>
        </section>
      }
    >
      <DocxEditorTool />
    </ToolPageLayout>
  );
}
