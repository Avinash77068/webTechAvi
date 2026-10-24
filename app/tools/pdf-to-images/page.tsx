import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { PdfToImagesTool } from "./pdf-to-images-tool";
import { getToolBySlug } from "@/lib/tools-registry";

const tool = getToolBySlug("pdf-to-images")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDescription,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function PdfToImagesPage() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <section aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-xl font-semibold">
            How to convert PDF pages to images
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Upload a PDF and select the pages you want to export.</li>
            <li>Choose JPEG or PNG and a resolution.</li>
            <li>Click "Export" and download pages individually or as a ZIP.</li>
          </ol>
        </section>
      }
    >
      <PdfToImagesTool />
    </ToolPageLayout>
  );
}
