/**
 * Visual "reserved space" box for previewing ad layout during development.
 * Never rendered for real visitors — see AdSlot, which only shows this when
 * NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS=true, for local layout review before a real
 * ad provider is configured.
 */
export function AdPlaceholder({ width, height }: { width: number; height: number }) {
  return (
    <div
      style={{ minHeight: height, maxWidth: width }}
      className="mx-auto flex w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-xs text-muted-foreground"
    >
      Ad space reserved ({width}×{height}) — no provider configured yet
    </div>
  );
}
