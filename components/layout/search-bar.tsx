"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { tools, type ToolDefinition } from "@/lib/tools-registry";

function searchTools(query: string): ToolDefinition[] {
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
  variant?: "hero" | "compact";
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  variant = "compact",
  placeholder = "What do you want to do today?",
  className,
  autoFocus,
}: SearchBarProps) {
  const router = useRouter();
  const listboxId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchTools(query), [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goToTool(tool: ToolDefinition) {
    if (tool.status !== "available") return;
    setOpen(false);
    setQuery("");
    router.push(`/tools/${tool.slug}`);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const chosen = results[activeIndex] ?? results[0];
      if (chosen) goToTool(chosen);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
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
            "w-full pl-11",
            variant === "hero" && "h-14 rounded-2xl pl-12 text-base shadow-sm"
          )}
        />
      </div>

      {open && query.trim() && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover p-1.5 shadow-lg"
        >
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
              No tools match &ldquo;{query}&rdquo; yet.
            </li>
          ) : (
            results.map((tool, index) => {
              const Icon = tool.icon;
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
                    <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                    <span className="flex-1 truncate">{tool.name}</span>
                    {isComingSoon && (
                      <Badge variant="secondary" className="shrink-0 text-[0.65rem]">
                        Coming soon
                      </Badge>
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
