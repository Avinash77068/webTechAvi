import Link from "next/link";
import { ArrowRight, FileImage, FileText, Files, Video } from "lucide-react";
import { ToolCard } from "@/components/tools/tool-card";
import { categoryMeta, getToolsByCategory, type ToolCategory } from "@/lib/tools-registry";

const categoryOrder: ToolCategory[] = ["image", "pdf", "document", "video-audio"];
const categoryIcons = {
  image: { icon: FileImage, className: "tool-card-icon--image" },
  pdf: { icon: FileText, className: "tool-card-icon--pdf" },
  document: { icon: Files, className: "tool-card-icon--document" },
  "video-audio": { icon: Video, className: "tool-card-icon--video-audio" },
} satisfies Record<ToolCategory, { icon: typeof FileImage; className: string }>;

export function CategorySections() {
  return (
    <div className="bg-muted/20">
      <div className="mx-auto max-w-7xl space-y-0 px-4 sm:px-6 lg:px-8">
        {categoryOrder.map((category) => {
          const meta = categoryMeta[category];
          const categoryTools = getToolsByCategory(category);
          const { icon: Icon, className: iconClass } = categoryIcons[category];

          return (
            <section key={category} id={category} className="border-b border-border/80 py-8 scroll-mt-24 sm:py-9">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{meta.label}</h2>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground sm:text-sm">{meta.description}</p>
                  </div>
                </div>
                <Link
                  href={`/tools?category=${category}`}
                  className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary/80 sm:text-sm"
                >
                  View all <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
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
