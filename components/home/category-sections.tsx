import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ToolCard } from "@/components/tools/tool-card";
import { categoryMeta, getToolsByCategory, type ToolCategory } from "@/lib/tools-registry";

const categoryOrder: ToolCategory[] = ["image", "pdf", "document", "video-audio"];

export function CategorySections() {
  return (
    <div className="bg-muted/30">
      <div className="mx-auto max-w-7xl space-y-14 px-4 py-14 sm:px-6 lg:px-8">
        {categoryOrder.map((category) => {
          const meta = categoryMeta[category];
          const categoryTools = getToolsByCategory(category);
          return (
            <section key={category}>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{meta.label}</h2>
                  <p className="mt-1 text-muted-foreground">{meta.description}</p>
                </div>
                <Link
                  href={`/tools?category=${category}`}
                  className="hidden shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
                >
                  View all
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
