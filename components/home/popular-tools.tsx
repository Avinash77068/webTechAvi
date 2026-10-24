import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ToolCard } from "@/components/tools/tool-card";
import { getPopularTools } from "@/lib/tools-registry";

export function PopularTools() {
  const popular = getPopularTools();
  if (popular.length === 0) return null;

  return (
    <section className="border-y border-border bg-card/25">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-9 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[0.67rem] font-bold uppercase tracking-[0.16em] text-sky-300">Start here</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-[1.75rem]">Popular tools</h2>
            <p className="mt-1 text-sm text-muted-foreground">Jump straight into the tools people use most.</p>
          </div>
          <Link href="/tools" className="mb-1 inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-sky-300 transition-colors hover:text-sky-100 sm:text-sm">
            View all tools <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
