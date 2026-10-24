"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
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
import { Brand } from "@/components/layout/brand";
import { SearchBar } from "@/components/layout/search-bar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { categoryMeta, getToolsByCategory, type ToolCategory } from "@/lib/tools-registry";

const categoryLinks = Object.entries(categoryMeta).map(([slug, meta]) => ({
  slug,
  label: meta.label,
  tools: getToolsByCategory(slug as ToolCategory),
}));

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/78">
      <div className="mx-auto flex h-[4.35rem] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Brand />

        <nav aria-label="Tool categories" className="hidden items-center gap-0.5 xl:flex">
          {categoryLinks.map((category) => (
            <DropdownMenu key={category.slug}>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="sm" className="gap-1 px-2.5 text-foreground/85 hover:text-foreground" />}
              >
                {category.label}
                <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 border-border bg-popover/98 shadow-xl backdrop-blur-xl">
                {category.tools.map((tool) =>
                  tool.status === "available" ? (
                    <DropdownMenuItem key={tool.slug} render={<Link href={`/tools/${tool.slug}`} />}>
                      <tool.icon className="size-4 text-primary" aria-hidden="true" />
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
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/tools" />}
            className="px-2.5 text-foreground/85 hover:text-foreground"
          >
            All Tools
          </Button>
        </nav>

        <div className="ml-auto hidden w-full max-w-[19rem] flex-1 md:flex xl:ml-auto">
          <SearchBar variant="compact" />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1 md:ml-0">
          <ThemeToggle />

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
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
              <div className="flex flex-col gap-5 px-4 pb-6">
                <div className="md:hidden">
                  <SearchBar variant="compact" />
                </div>
                <nav aria-label="Tool categories" className="flex flex-col gap-3">
                  {categoryLinks.map((category) => (
                    <div key={category.slug}>
                      <Link
                        href={`/tools?category=${category.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="mb-1 block px-3 py-1.5 text-xs font-bold uppercase tracking-[0.13em] text-primary"
                      >
                        {category.label}
                      </Link>
                      {category.tools.filter((tool) => tool.status === "available").map((tool) => (
                        <Link
                          key={tool.slug}
                          href={`/tools/${tool.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground/85 transition-colors hover:bg-accent hover:text-foreground"
                        >
                          <tool.icon className="size-4 text-muted-foreground" aria-hidden="true" />
                          {tool.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                  <Link
                    href="/tools"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-semibold hover:border-primary/50 hover:text-primary"
                  >
                    Browse all tools
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
