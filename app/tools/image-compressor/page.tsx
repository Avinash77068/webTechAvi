import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { ImageCompressorTool } from "@/features/image-compressor";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("image-compressor")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDescription,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function ImageCompressorPage() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <section aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-xl font-semibold">
            How to use the Image Compressor
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Drag and drop one or more JPG, PNG or WebP images, or click to browse.</li>
            <li>Adjust the quality slider and pick an output format (or keep the original).</li>
            <li>Click "Compress images" and review the before/after file size for each image.</li>
            <li>Download the compressed images you want to keep.</li>
          </ol>
        </section>
      }
    >
      <ImageCompressorTool />
    </ToolPageLayout>
  );
}
