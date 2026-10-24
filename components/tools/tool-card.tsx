import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ToolDefinition } from "@/lib/tools-registry";

export function ToolCard({ tool, className }: { tool: ToolDefinition; className?: string }) {
  const Icon = tool.icon;
  const isAvailable = tool.status === "available";

  const content = (
    <>
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{tool.name}</h3>
          {!isAvailable && (
            <Badge variant="secondary" className="text-[0.65rem]">
              Coming soon
            </Badge>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{tool.shortDescription}</p>
      </div>
    </>
  );

  const sharedClasses = cn(
    "flex h-full items-start gap-3.5 rounded-2xl border border-border bg-card p-4 transition-all",
    isAvailable ? "hover:border-primary/40 hover:shadow-md" : "opacity-70",
    className
  );

  if (!isAvailable) {
    return (
      <div className={sharedClasses} aria-disabled="true">
        {content}
      </div>
    );
  }

  return (
    <Link href={`/tools/${tool.slug}`} className={cn(sharedClasses, "focus-visible:ring-3 focus-visible:ring-ring/50 outline-none")}>
      {content}
    </Link>
  );
}
