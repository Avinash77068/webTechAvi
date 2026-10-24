import Link from "next/link";
import { Lock, Sparkles, Zap } from "lucide-react";
import { SearchBar } from "@/components/layout/search-bar";
import { categoryMeta } from "@/lib/tools-registry";

const trustPoints = [
  { icon: Zap, label: "No sign-up required" },
  { icon: Lock, label: "Processed in your browser" },
  { icon: Sparkles, label: "100% free, ad-supported" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          Free Online Tools.
          <br />
          <span className="text-primary">Simple, Fast, Private.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground text-pretty">
          Compress images, merge PDFs, extract text and more — real tools that run right in
          your browser. No sign-up, no file uploads to a server unless clearly stated.
        </p>

        <div className="mx-auto mt-8 max-w-xl">
          <SearchBar variant="hero" autoFocus={false} />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {Object.entries(categoryMeta).map(([slug, meta]) => (
            <Link
              key={slug}
              href={`/tools?category=${slug}`}
              className="rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-accent"
            >
              {meta.label}
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
          {trustPoints.map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-2">
              <Icon className="size-4 text-primary" aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
