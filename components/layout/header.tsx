import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { NavDropdownCloser } from "@/components/layout/nav-dropdown-closer";
import { SearchBar } from "@/components/layout/search-bar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  categoryMeta,
  getToolSearchIndex,
  getToolsByCategory,
  type ToolCategory,
} from "@/lib/tools-registry";

const categoryGroups = Object.entries(categoryMeta).map(([slug, meta]) => ({
  slug,
  label: meta.label,
  tools: getToolsByCategory(slug as ToolCategory),
}));

const mobileCategories = categoryGroups.map(({ slug, label, tools }) => ({
  slug,
  label,
  tools: tools.map(({ slug, name, status }) => ({ slug, name, status })),
}));

const toolSearchIndex = getToolSearchIndex();

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/78">
      <div className="mx-auto flex h-[4.35rem] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Brand />

        <nav aria-label="Tool categories" data-nav-dropdowns className="hidden items-center gap-0.5 xl:flex">
          <NavDropdownCloser />
          {categoryGroups.map((category) => (
            <details key={category.slug} className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-semibold text-foreground/85 transition-colors hover:bg-accent hover:text-foreground">
                {category.label}
                <ChevronDown className="size-3.5 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <div className="absolute top-full left-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-popover/98 p-1.5 shadow-xl backdrop-blur-xl">
                {category.tools.map((tool) => {
                  const Icon = tool.icon;
                  return tool.status === "available" ? (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground/90 transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <Icon className="size-4 text-primary" aria-hidden="true" />
                      {tool.name}
                    </Link>
                  ) : (
                    <span key={tool.slug} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground">
                      <Icon className="size-4" aria-hidden="true" />
                      {tool.name}
                      <span className="ml-auto text-xs">Soon</span>
                    </span>
                  );
                })}
              </div>
            </details>
          ))}
          <Link
            href="/tools"
            className="rounded-lg px-2.5 py-2 text-xs font-semibold text-foreground/85 transition-colors hover:bg-accent hover:text-foreground"
          >
            All Tools
          </Link>
        </nav>

        <div className="ml-auto hidden w-full max-w-[19rem] flex-1 md:flex xl:ml-auto">
          <SearchBar tools={toolSearchIndex} variant="compact" />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1 md:ml-0">
          <ThemeToggle />
          <MobileMenu categories={mobileCategories} searchTools={toolSearchIndex} />
        </div>
      </div>
    </header>
  );
}
