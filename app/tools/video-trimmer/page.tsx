import { createPageMetadata } from "@/lib/page-metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { VideoTrimmerTool } from "@/features/video-trimmer";
import { getToolBySlug, getToolSeoTitle } from "@/lib/tools-registry";

const tool = getToolBySlug("video-trimmer")!;

export const metadata = createPageMetadata({
  title: getToolSeoTitle(tool),
  description: tool.shortDescription,
  path: `/tools/${tool.slug}`,
  keywords: tool.keywords,
});

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
