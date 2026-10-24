import type { Metadata } from "next";
import { Suspense } from "react";
import { ToolsDirectoryClient } from "./tools-directory-client";

export const metadata: Metadata = {
  title: "All Tools",
  description: "Browse every TechSutra tool for images, PDFs, documents, video and audio.",
  alternates: { canonical: "/tools" },
};

export default function ToolsDirectoryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">All Tools</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Browse every tool by category, or search by name.
      </p>

      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading tools…</p>}>
          <ToolsDirectoryClient />
        </Suspense>
      </div>
    </div>
  );
}
