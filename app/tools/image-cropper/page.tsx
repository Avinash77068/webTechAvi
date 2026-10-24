import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { ImageCropperTool } from "./image-cropper-tool";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("image-cropper")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDescription,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function ImageCropperPage() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <section aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-xl font-semibold">
            How to use the Image Cropper
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Upload a JPG, PNG or WebP image.</li>
            <li>Pick an aspect ratio, or leave it free-form and drag the crop handles.</li>
            <li>Rotate the image if needed, then click "Crop image".</li>
            <li>Download the cropped result.</li>
          </ol>
        </section>
      }
    >
      <ImageCropperTool />
    </ToolPageLayout>
  );
}
