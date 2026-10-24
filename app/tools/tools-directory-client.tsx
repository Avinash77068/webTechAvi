"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { categoryMeta, tools, type ToolCategory } from "@/lib/tools-registry";
import { ToolCard } from "@/components/tools/tool-card";

const categories: { value: ToolCategory | "all"; label: string }[] = [
  { value: "all", label: "All tools" },
  ...(Object.entries(categoryMeta).map(([value, meta]) => ({
    value: value as ToolCategory,
    label: meta.label,
  })) satisfies { value: ToolCategory; label: string }[]),
];

export function ToolsDirectoryClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get("category") as ToolCategory | null) ?? "all";

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "all">(initialCategory);

  function selectCategory(category: ToolCategory | "all") {
    setActiveCategory(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") params.delete("category");
    else params.set("category", category);
    router.replace(params.size > 0 ? `/tools?${params.toString()}` : "/tools", { scroll: false });
  }

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((tool) => {
      const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      const haystack = [tool.name, tool.shortDescription, ...tool.keywords].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [activeCategory, query]);

  return (
    <div>
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools…"
          aria-label="Search tools"
          className="pl-10"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
        {categories.map((category) => (
          <Button
            key={category.value}
            type="button"
            role="tab"
            aria-selected={activeCategory === category.value}
            variant={activeCategory === category.value ? "default" : "outline"}
            size="sm"
            onClick={() => selectCategory(category.value)}
            className={cn("rounded-full")}
          >
            {category.label}
          </Button>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        {filteredTools.length} tool{filteredTools.length === 1 ? "" : "s"} found
      </p>

      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No tools match your search. Try a different keyword or category.
        </div>
      )}
    </div>
  );
}
