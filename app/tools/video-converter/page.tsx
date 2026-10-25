import { createPageMetadata } from "@/lib/page-metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { VideoConverterTool } from "@/features/video-converter";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("video-converter")!;

export const metadata = createPageMetadata({
  title: "Video Converter & Compressor Online Free",
  description:
    "Convert or compress MP4 and WebM videos online. Choose an output format, quality and resolution, then download the processed video.",
  path: `/tools/${tool.slug}`,
  keywords: tool.keywords,
});

export default function VideoConverterPage() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <section aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-xl font-semibold">
            How to convert or compress a video
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Upload an MP4 or WebM video.</li>
            <li>Pick an output format, quality and resolution.</li>
            <li>Click &quot;Convert video&quot; and download the result.</li>
          </ol>
        </section>
      }
    >
      <VideoConverterTool />
    </ToolPageLayout>
  );
}
