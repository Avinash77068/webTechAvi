import { createPageMetadata } from "@/lib/page-metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { OrganizePdfTool } from "@/features/organize-pdf";
import { getToolBySlug, getToolSeoTitle } from "@/lib/tools-registry";

const tool = getToolBySlug("organize-pdf")!;

export const metadata = createPageMetadata({
  title: getToolSeoTitle(tool),
  description: tool.shortDescription,
  path: `/tools/${tool.slug}`,
  keywords: tool.keywords,
});

export default function OrganizePdfPage() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <section aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-xl font-semibold">
            How to reorder, rotate or remove PDF pages
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Upload a PDF — every page loads as a thumbnail.</li>
            <li>Use the arrows to reorder pages, the rotate button to turn a page, or remove to delete it.</li>
            <li>Click "Export PDF" and download the result.</li>
          </ol>
        </section>
      }
    >
      <OrganizePdfTool />
    </ToolPageLayout>
  );
}
