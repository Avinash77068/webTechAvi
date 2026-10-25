import { createPageMetadata } from "@/lib/page-metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { ImageConverterTool } from "@/features/image-converter";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("image-converter")!;

export const metadata = createPageMetadata({
  title: tool.name,
  description: tool.shortDescription,
  path: `/tools/${tool.slug}`,
  keywords: tool.keywords,
});

export default function ImageConverterPage() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <section aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-xl font-semibold">
            How to use the Image Format Converter
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Upload one or more JPG, PNG or WebP images.</li>
            <li>Choose the format you want to convert to.</li>
            <li>Click "Convert images" and download each converted file.</li>
          </ol>
        </section>
      }
    >
      <ImageConverterTool />
    </ToolPageLayout>
  );
}
