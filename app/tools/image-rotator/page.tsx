import { createPageMetadata } from "@/lib/page-metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { ImageRotatorTool } from "@/features/image-rotator";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("image-rotator")!;

export const metadata = createPageMetadata({
  title: "Rotate Multiple Images at Once – Free Bulk Image Rotator",
  description:
    "Rotate many JPG, PNG and WebP photos at once by any angle. Select the images, enter the degrees and download them individually or as a ZIP — all in your browser.",
  path: `/tools/${tool.slug}`,
  keywords: tool.keywords,
});

export default function ImageRotatorPage() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <section aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-xl font-semibold">
            How to rotate multiple images
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Drag and drop one or more JPG, PNG or WebP images, or click to browse.</li>
            <li>Tick the images you want to rotate (all are selected by default).</li>
            <li>Enter the rotation angle in degrees or pick a preset like 90°, 180° or 270°.</li>
            <li>Click "Rotate selected", choose the download type and download all images as a ZIP.</li>
          </ol>
        </section>
      }
    >
      <ImageRotatorTool />
    </ToolPageLayout>
  );
}
