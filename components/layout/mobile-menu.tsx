"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { SearchBar } from "@/components/layout/search-bar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { ToolSearchEntry } from "@/lib/tools-registry";

interface MobileCategory {
  slug: string;
  label: string;
  tools: Array<{ slug: string; name: string; status: "available" | "coming-soon" }>;
}

export function MobileMenu({
  categories,
  searchTools,
}: {
  categories: MobileCategory[];
  searchTools: ToolSearchEntry[];
}) {
  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="outline" size="icon" className="border-border bg-card/70 xl:hidden" aria-label="Open menu" />}
      >
        <Menu className="size-5" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(22rem,92vw)] border-border bg-background">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <Brand />
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-5 overflow-y-auto px-4 pb-6">
          <div className="md:hidden">
            <SearchBar tools={searchTools} variant="compact" />
          </div>
          <nav aria-label="Tool categories" className="flex flex-col gap-3">
            {categories.map((category) => (
              <div key={category.slug}>
                <Link
                  href={`/tools/category/${category.slug}`}
                  className="mb-1 block px-3 py-1.5 text-xs font-bold uppercase tracking-[0.13em] text-primary"
                >
                  {category.label}
                </Link>
                {category.tools
                  .filter((tool) => tool.status === "available")
                  .map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className="block rounded-lg px-3 py-2 text-sm text-foreground/85 transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {tool.name}
                    </Link>
                  ))}
              </div>
            ))}
            <Link
              href="/tools"
              className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-semibold hover:border-primary/50 hover:text-primary"
            >
              Browse all tools
            </Link>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
