import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PageThumb {
  pageNumber: number;
  dataUrl: string;
}

export function SelectablePageGrid({
  pages,
  selected,
  onToggle,
}: {
  pages: PageThumb[];
  selected: Set<number>;
  onToggle: (pageNumber: number) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
      {pages.map((page) => {
        const isSelected = selected.has(page.pageNumber);
        return (
          <button
            key={page.pageNumber}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onToggle(page.pageNumber)}
            className={cn(
              "group relative overflow-hidden rounded-lg border-2 bg-muted/20 outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
              isSelected ? "border-primary" : "border-border hover:border-primary/40"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={page.dataUrl} alt={`Page ${page.pageNumber}`} className="w-full bg-white" />
            <span
              className={cn(
                "absolute inset-x-0 bottom-0 bg-background/90 px-1.5 py-1 text-center text-xs font-medium",
                isSelected && "text-primary"
              )}
            >
              Page {page.pageNumber}
            </span>
            {isSelected && (
              <span className="absolute top-1.5 right-1.5 rounded-full bg-background">
                <CheckCircle2 className="size-5 text-primary" aria-hidden="true" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
