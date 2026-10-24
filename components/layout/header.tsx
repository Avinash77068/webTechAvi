"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchBar } from "@/components/layout/search-bar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { siteConfig } from "@/lib/site-config";
import { categoryMeta, getToolsByCategory, type ToolCategory } from "@/lib/tools-registry";

const categoryLinks = Object.entries(categoryMeta).map(([slug, meta]) => ({
  slug,
  label: meta.label,
  tools: getToolsByCategory(slug as ToolCategory),
}));

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4.5" aria-hidden="true" />
          </span>
          <span className="text-lg">{siteConfig.name}</span>
        </Link>

        <nav aria-label="Tool categories" className="hidden items-center gap-1 lg:flex">
          {categoryLinks.map((category) => (
            <DropdownMenu key={category.slug}>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="sm" className="gap-1" />}
              >
                {category.label}
                <ChevronDown className="size-3.5" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60">
                {category.tools.map((tool) =>
                  tool.status === "available" ? (
                    <DropdownMenuItem key={tool.slug} render={<Link href={`/tools/${tool.slug}`} />}>
                      <tool.icon className="size-4" aria-hidden="true" />
                      {tool.name}
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem key={tool.slug} disabled>
                      <tool.icon className="size-4" aria-hidden="true" />
                      {tool.name}
                      <span className="ml-auto text-xs text-muted-foreground">Soon</span>
                    </DropdownMenuItem>
                  ),
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/tools" />}>
            All Tools
          </Button>
        </nav>

        <div className="ml-auto hidden max-w-xs flex-1 md:flex">
          <SearchBar variant="compact" />
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <ThemeToggle />

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" />}
            >
              <Menu className="size-5" aria-hidden="true" />
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 px-4 pb-6">
                <div className="md:hidden">
                  <SearchBar variant="compact" />
                </div>
                <nav aria-label="Tool categories" className="flex flex-col gap-1">
                  {categoryLinks.map((category) => (
                    <div key={category.slug} className="mb-2">
                      <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {category.label}
                      </p>
                      {category.tools.filter((t) => t.status === "available").map((tool) => (
                        <Link
                          key={tool.slug}
                          href={`/tools/${tool.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                        >
                          <tool.icon className="size-4" aria-hidden="true" />
                          {tool.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                  <Link
                    href="/tools"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    All Tools
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
