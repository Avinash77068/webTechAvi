/** Visual reserved-space preview for local development only. */
export function AdPlaceholder({ width, height }: { width: number; height: number }) {
  return (
    <div
      style={{ minHeight: height, maxWidth: width }}
      className="mx-auto flex w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-xs text-muted-foreground"
    >
      Ad space preview ({width}×{height}) — ads disabled in development
    </div>
  );
}
