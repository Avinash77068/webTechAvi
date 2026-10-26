import { createPageMetadata } from "@/lib/page-metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { PhotoEditorTool } from "@/features/photo-editor";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("photo-editor")!;

export const metadata = createPageMetadata({
  title: tool.name,
  description: tool.shortDescription,
  path: `/tools/${tool.slug}`,
  keywords: tool.keywords,
});

export default function PhotoEditorPage() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <section aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-xl font-semibold">
            How to use the Photo Editor
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Upload a JPG, PNG or WebP photo.</li>
            <li>Pick a crop shape and drag the handles. Rotate or flip if needed.</li>
            <li>Tap Auto enhance, or adjust brightness, contrast and colour. Use &ldquo;Whiten the background&rdquo; for a grey wall.</li>
            <li>Choose a format, set a size limit if your form needs one, then click &ldquo;Apply and preview&rdquo; and download.</li>
          </ol>
        </section>
      }
    >
      <PhotoEditorTool />
    </ToolPageLayout>
  );
}
