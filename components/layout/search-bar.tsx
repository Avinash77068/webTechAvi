"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ToolSearchEntry } from "@/lib/tools-registry";

function searchTools(query: string, tools: ToolSearchEntry[]): ToolSearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return tools
    .filter((tool) => {
      const haystack = [tool.name, tool.shortDescription, ...tool.keywords]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    })
    .sort((a, b) => Number(b.status === "available") - Number(a.status === "available"))
    .slice(0, 7);
}

interface SearchBarProps {
  tools: ToolSearchEntry[];
  variant?: "hero" | "compact";
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
}

export function SearchBar({
  tools,
  variant = "compact",
  placeholder = "What do you want to do today?",
  className,
  autoFocus,
  onNavigate,
}: SearchBarProps) {
  const router = useRouter();
  const listboxId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchTools(query, tools), [query, tools]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goToTool(tool: ToolSearchEntry) {
    if (tool.status !== "available") return;
    setOpen(false);
    setQuery("");
    onNavigate?.();
    router.push(`/tools/${tool.slug}`);
  }

  function submitSearch() {
    const search = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "";
    setOpen(false);
    onNavigate?.();
    router.push(`/tools${search}`);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const chosen = open ? results[activeIndex] ?? results[0] : undefined;
      if (chosen?.status === "available") goToTool(chosen);
      else submitSearch();
      return;
    }

    if (!open || results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    }
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-primary"
          aria-hidden="true"
        />
        <input
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls={listboxId}
          aria-autocomplete="list"
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search tools"
          className={cn(
            "h-10 w-full rounded-full border border-border/90 bg-card/75 px-3 pl-11 text-sm text-foreground outline-none placeholder:text-muted-foreground/85 focus-visible:border-primary/75 focus-visible:ring-2 focus-visible:ring-primary/25",
            variant === "hero" && "h-[3.55rem] rounded-[1rem] border-primary/35 bg-card/95 pl-12 pr-16 text-base shadow-[0_12px_38px_rgba(0,0,0,0.12)] placeholder:text-muted-foreground focus-visible:border-primary/70 focus-visible:ring-primary/25"
          )}
        />
        {variant === "hero" && (
          <button
            type="button"
            onClick={submitSearch}
            aria-label="Search tools"
            className="absolute top-1/2 right-1.5 flex size-11 -translate-y-1/2 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-blue-950/35 transition-transform hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
          >
            <ArrowRight className="size-5" aria-hidden="true" />
          </button>
        )}
      </div>

      {open && query.trim() && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover p-1.5 shadow-2xl shadow-black/25"
        >
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
              No tools match &ldquo;{query}&rdquo; yet.
            </li>
          ) : (
            results.map((tool, index) => {
              const isComingSoon = tool.status !== "available";
              return (
                <li key={tool.slug} role="option" aria-selected={index === activeIndex}>
                  <button
                    type="button"
                    disabled={isComingSoon}
                    onClick={() => goToTool(tool)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                      index === activeIndex && !isComingSoon && "bg-accent text-accent-foreground",
                      isComingSoon && "cursor-not-allowed opacity-60"
                    )}
                  >
                    <Search className="size-4 shrink-0 text-primary" aria-hidden="true" />
                    <span className="flex-1 truncate">{tool.name}</span>
                    {isComingSoon && (
                      <span className="shrink-0 rounded-md bg-secondary px-2 py-0.5 text-[0.65rem] text-secondary-foreground">
                        Coming soon
                      </span>
                    )}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
