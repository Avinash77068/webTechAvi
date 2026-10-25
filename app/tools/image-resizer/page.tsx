import { createPageMetadata } from "@/lib/page-metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { ImageResizerTool } from "@/features/image-resizer";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("image-resizer")!;

export const metadata = createPageMetadata({
  title: tool.name,
  description: tool.shortDescription,
  path: `/tools/${tool.slug}`,
  keywords: tool.keywords,
});

export default function ImageResizerPage() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <section aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-xl font-semibold">
            How to use the Image Resizer
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Upload a JPG, PNG or WebP image.</li>
            <li>Enter a width or height, or use a percentage preset.</li>
            <li>Keep "Maintain aspect ratio" on to avoid distortion, or turn it off for exact dimensions.</li>
            <li>Click "Resize image" and download the result.</li>
          </ol>
        </section>
      }
    >
      <ImageResizerTool />
    </ToolPageLayout>
  );
}
