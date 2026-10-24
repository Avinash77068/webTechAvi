import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { ImageToTextTool } from "./image-to-text-tool";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("image-to-text")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDescription,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function ImageToTextPage() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <section aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-xl font-semibold">
            How to use Image to Text (OCR)
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Upload a photo or screenshot that contains text.</li>
            <li>Choose English or Hindi as the recognition language.</li>
            <li>Click "Extract text" and wait while the OCR engine processes the image.</li>
            <li>Edit the extracted text if needed, then copy or download it as a TXT file.</li>
          </ol>
        </section>
      }
    >
      <ImageToTextTool />
    </ToolPageLayout>
  );
}
