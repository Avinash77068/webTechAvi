import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function ProcessingProgress({
  label,
  progress,
}: {
  label: string;
  /** 0-100, or undefined for an indeterminate state */
  progress?: number;
}) {
  return (
    <div role="status" aria-live="polite" className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Loader2 className="size-4 animate-spin text-primary" aria-hidden="true" />
        <span>{label}</span>
        {typeof progress === "number" && (
          <span className="ml-auto text-muted-foreground">{Math.round(progress)}%</span>
        )}
      </div>
      <Progress className="mt-3" value={typeof progress === "number" ? progress : null} />
    </div>
  );
}
