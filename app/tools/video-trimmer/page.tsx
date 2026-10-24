import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { VideoTrimmerTool } from "@/features/video-trimmer";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("video-trimmer")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDescription,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function VideoTrimmerPage() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <section aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-xl font-semibold">
            How to trim a video
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Upload an MP4 or WebM video from your device.</li>
            <li>Drag the start and end sliders to choose the part you want to keep.</li>
            <li>Click &quot;Trim video&quot;, preview the clip and download it.</li>
          </ol>
        </section>
      }
    >
      <VideoTrimmerTool />
    </ToolPageLayout>
  );
}
