import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ToolDefinition } from "@/lib/tools-registry";

export function ToolCard({ tool, className }: { tool: ToolDefinition; className?: string }) {
  const Icon = tool.icon;
  const isAvailable = tool.status === "available";
  const iconClass = `tool-card-icon--${tool.category}`;

  const content = (
    <>
      <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", iconClass)}>
        <Icon className="size-[1.15rem]" aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col justify-center">
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-semibold tracking-tight text-foreground">{tool.name}</span>
          {!isAvailable && (
            <Badge variant="secondary" className="shrink-0 text-[0.62rem]">
              Coming soon
            </Badge>
          )}
        </span>
        <span className="mt-1 line-clamp-2 text-xs leading-[1.15rem] text-muted-foreground">
          {tool.shortDescription}
        </span>
      </span>
      {isAvailable && (
        <ArrowUpRight className="size-4 shrink-0 text-sky-300/75 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
      )}
    </>
  );

  const sharedClasses = cn(
    "tool-card group flex h-full min-h-[5.2rem] items-center gap-3 p-3.5 text-left",
    isAvailable ? "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none" : "opacity-70",
    className,
  );

  if (!isAvailable) {
    return (
      <div className={sharedClasses} aria-disabled="true">
        {content}
      </div>
    );
  }

  return (
    <Link href={`/tools/${tool.slug}`} className={sharedClasses}>
      {content}
    </Link>
  );
}
