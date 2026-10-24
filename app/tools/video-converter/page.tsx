import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { VideoConverterTool } from "@/features/video-converter";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("video-converter")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDescription,
  alternates: { canonical: `/tools/${tool.slug}` },
};

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
