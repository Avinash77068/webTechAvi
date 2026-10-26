import { createPageMetadata } from "@/lib/page-metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { SignatureMakerTool } from "@/features/signature-maker";
import { getToolBySlug, getToolSeoTitle } from "@/lib/tools-registry";

const tool = getToolBySlug("signature-maker")!;

export const metadata = createPageMetadata({
  title: getToolSeoTitle(tool),
  description: tool.shortDescription,
  path: `/tools/${tool.slug}`,
  keywords: tool.keywords,
});

export default function SignatureMakerPage() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <section aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-xl font-semibold">
            How to use the Signature Maker
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Choose Draw, Type or From a photo, and make your signature.</li>
            <li>Pick the ink colour. For a drawing, set the pen width and use Undo to fix a slip.</li>
            <li>Choose Transparent PNG, or Exact size JPG and enter the pixels and KB limit from your form.</li>
            <li>Check the preview and download.</li>
          </ol>
        </section>
      }
    >
      <SignatureMakerTool />
    </ToolPageLayout>
  );
}
