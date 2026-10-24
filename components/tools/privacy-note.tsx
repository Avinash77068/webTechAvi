import { ShieldCheck } from "lucide-react";

export function PrivacyNote({ note }: { note: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4 text-sm">
      <ShieldCheck className="mt-0.5 size-4.5 shrink-0 text-primary" aria-hidden="true" />
      <p className="text-muted-foreground">{note}</p>
    </div>
  );
}
