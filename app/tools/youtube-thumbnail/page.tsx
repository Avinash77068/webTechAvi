import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { YoutubeThumbnailTool } from "@/features/youtube-thumbnail";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("youtube-thumbnail")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDescription,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function YoutubeThumbnailPage() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <section aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-xl font-semibold">
            How to use the YouTube Thumbnail Viewer
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Paste a YouTube video URL (or just its video ID).</li>
            <li>Click "View thumbnails" to see every resolution YouTube has published for it.</li>
            <li>Click "Open" on any thumbnail to view it full-size or save it from your browser.</li>
          </ol>
        </section>
      }
    >
      <YoutubeThumbnailTool />
    </ToolPageLayout>
  );
}
