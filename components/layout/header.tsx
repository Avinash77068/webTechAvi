"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchBar } from "@/components/layout/search-bar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { siteConfig } from "@/lib/site-config";
import { categoryMeta } from "@/lib/tools-registry";

const categoryLinks = Object.entries(categoryMeta).map(([slug, meta]) => ({
  slug,
  label: meta.label,
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
            <Button
              key={category.slug}
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href={`/tools?category=${category.slug}`} />}
            >
              {category.label}
            </Button>
          ))}
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/blog" />}>
            Blog
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
                    <Link
                      key={category.slug}
                      href={`/tools?category=${category.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                    >
                      {category.label}
                    </Link>
                  ))}
                  <Link
                    href="/tools"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    All Tools
                  </Link>
                  <Link
                    href="/blog"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    Blog
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
