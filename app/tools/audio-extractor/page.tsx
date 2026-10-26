import { createPageMetadata } from "@/lib/page-metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { AudioExtractorTool } from "@/features/audio-extractor";
import { getToolBySlug, getToolSeoTitle } from "@/lib/tools-registry";

const tool = getToolBySlug("audio-extractor")!;

export const metadata = createPageMetadata({
  title: getToolSeoTitle(tool),
  description: tool.shortDescription,
  path: `/tools/${tool.slug}`,
  keywords: tool.keywords,
});

export default function AudioExtractorPage() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <section aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-xl font-semibold">
            How to extract audio from a video
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Upload an MP4 or WebM video.</li>
            <li>Choose MP3, M4A or WAV.</li>
            <li>Click &quot;Extract audio&quot;, listen to a preview and download it.</li>
          </ol>
        </section>
      }
    >
      <AudioExtractorTool />
    </ToolPageLayout>
  );
}
