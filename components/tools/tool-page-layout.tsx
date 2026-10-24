import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/tools/breadcrumbs";
import { PrivacyNote } from "@/components/tools/privacy-note";
import { FaqSection } from "@/components/tools/faq-section";
import { RelatedTools } from "@/components/tools/related-tools";
import { AdSlot } from "@/components/ads/ad-slot";
import { categoryMeta, getRelatedTools, type ToolDefinition } from "@/lib/tools-registry";

export function ToolPageLayout({
  tool,
  children,
  instructions,
}: {
  tool: ToolDefinition;
  children: ReactNode;
  instructions?: ReactNode;
}) {
  const related = getRelatedTools(tool);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: categoryMeta[tool.category].label, href: `/tools?category=${tool.category}` },
          { label: tool.name },
        ]}
      />

      <div className="mt-4 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{tool.name}</h1>
        <p className="mt-3 text-base text-muted-foreground">{tool.description}</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0">{children}</div>

        <aside className="space-y-5">
          <PrivacyNote note={tool.privacyNote} />

          <div className="rounded-xl border border-border bg-card p-4 text-sm">
            <h2 className="font-semibold">Supported formats</h2>
            <p className="mt-1 text-muted-foreground">{tool.acceptedFormats.join(", ")}</p>
            {tool.maxFileSizeMB > 0 && (
              <p className="mt-1 text-muted-foreground">Max file size: {tool.maxFileSizeMB} MB per file</p>
            )}
          </div>

          <AdSlot placement="tool-sidebar" />
        </aside>
      </div>

      <div className="mt-14 space-y-10">
        {instructions}
        <FaqSection faqs={tool.faqs} />
        <RelatedTools tools={related} />
      </div>
    </div>
  );
}
