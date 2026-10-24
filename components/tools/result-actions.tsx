import type { ReactNode } from "react";
import { Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ResultActions({
  onDownload,
  onReset,
  downloadLabel = "Download",
  resetLabel = "Start over",
  extra,
}: {
  onDownload?: () => void;
  onReset: () => void;
  downloadLabel?: string;
  resetLabel?: string;
  extra?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {onDownload && (
        <Button type="button" onClick={onDownload}>
          <Download aria-hidden="true" />
          {downloadLabel}
        </Button>
      )}
      {extra}
      <Button type="button" variant="outline" onClick={onReset}>
        <RotateCcw aria-hidden="true" />
        {resetLabel}
      </Button>
    </div>
  );
}
