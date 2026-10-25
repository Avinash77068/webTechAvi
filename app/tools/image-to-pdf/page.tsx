import { createPageMetadata } from "@/lib/page-metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { ImageToPdfTool } from "@/features/image-to-pdf";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("image-to-pdf")!;

export const metadata = createPageMetadata({
  title: tool.name,
  description: tool.shortDescription,
  path: `/tools/${tool.slug}`,
  keywords: tool.keywords,
});

export default function ImageToPdfPage() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <section aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-xl font-semibold">
            How to use Image to PDF
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Upload one or more JPG, PNG or WebP images.</li>
            <li>Reorder them with the up/down arrows if needed.</li>
            <li>Choose a page size and orientation.</li>
            <li>Click "Generate PDF" and download the result.</li>
          </ol>
        </section>
      }
    >
      <ImageToPdfTool />
    </ToolPageLayout>
  );
}
