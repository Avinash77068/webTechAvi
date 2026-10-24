import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { AudioExtractorTool } from "@/features/audio-extractor";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("audio-extractor")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDescription,
  alternates: { canonical: `/tools/${tool.slug}` },
};

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
