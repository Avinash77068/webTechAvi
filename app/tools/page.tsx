import type { Metadata } from "next";
import { Suspense } from "react";
import { ToolsDirectoryClient } from "./tools-directory-client";
import { getAvailableTools } from "@/lib/tools-registry";

export const metadata: Metadata = {
  title: "All Tools",
  description: "Browse every TechSutra tool for images, PDFs, documents, video and audio.",
  alternates: { canonical: "/tools" },
};

export default function ToolsDirectoryPage() {
  const toolCount = getAvailableTools().length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-accent px-5 py-7 sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute -right-12 -top-20 size-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[0.67rem] font-bold uppercase tracking-[0.16em] text-primary">The TechSutra toolkit</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">All tools, one place.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Browse the full collection by category, or search for the task you need to get done.
            </p>
          </div>
          <div className="rounded-xl border border-primary/15 bg-primary/[0.07] px-4 py-3 text-right">
            <p className="text-2xl font-bold tracking-tight text-foreground">{toolCount}</p>
            <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-muted-foreground">free tools</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Suspense fallback={<p className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">Loading tools…</p>}>
          <ToolsDirectoryClient />
        </Suspense>
      </div>
    </div>
  );
}
