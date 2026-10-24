import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the ${siteConfig.name} team.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Contact</h1>
      <p className="mt-3 text-muted-foreground">
        Found a bug, have a feature request, or a question about how a tool works? Email us —
        we read every message.
      </p>

      <a
        href={`mailto:${siteConfig.contactEmail}`}
        className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 font-medium transition-colors hover:border-primary/40 hover:bg-accent"
      >
        <Mail className="size-4.5 text-primary" aria-hidden="true" />
        {siteConfig.contactEmail}
      </a>

      <p className="mt-8 text-sm text-muted-foreground">
        For bug reports, it helps to mention which tool you were using, your browser, and what
        you expected to happen.
      </p>
    </div>
  );
}
