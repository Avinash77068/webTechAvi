import type { ReactNode } from "react";
import { Lock, Sparkles, Zap } from "lucide-react";
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
  hero = false,
}: {
  tool: ToolDefinition;
  children: ReactNode;
  instructions?: ReactNode;
  hero?: boolean;
}) {
  const related = getRelatedTools(tool);

  if (hero) {
    const Icon = tool.icon;
    return (
      <div>
        <section className="border-b border-border bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-16">
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start">
                <Breadcrumbs
                  items={[
                    { label: categoryMeta[tool.category].label, href: `/tools?category=${tool.category}` },
                    { label: tool.name },
                  ]}
                />
              </div>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
                {tool.name}
                <br />
                <span className="text-primary">Simple, Fast, Private.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground lg:mx-0">
                {tool.description}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground lg:justify-start">
                {[
                  { icon: Zap, label: "No sign-up required" },
                  { icon: Lock, label: "Processed in your browser" },
                  { icon: Sparkles, label: "100% free" },
                ].map(({ icon: TrustIcon, label }) => (
                  <span key={label} className="flex items-center gap-2">
                    <TrustIcon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="mx-auto w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Icon className="size-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{tool.name}</h2>
                  <p className="text-sm text-muted-foreground">{tool.shortDescription}</p>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-background p-4 text-sm">
                <h3 className="font-semibold">Supported formats</h3>
                <p className="mt-1 text-muted-foreground">{tool.acceptedFormats.join(", ")}</p>
                {tool.maxFileSizeMB > 0 && (
                  <p className="mt-1 text-muted-foreground">Max file size: {tool.maxFileSizeMB} MB per file</p>
                )}
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary/5 p-4 text-sm">
                <Lock className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{tool.privacyNote}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-xl sm:p-6">{children}</div>
          <div className="mt-4">
            <AdSlot placement="tool-sidebar" />
          </div>
          <div className="mt-14 space-y-10">
            {instructions}
            <FaqSection faqs={tool.faqs} />
            <RelatedTools tools={related} />
          </div>
        </div>
      </div>
    );
  }

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
