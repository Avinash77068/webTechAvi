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
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-12">

        {/* Left Side */}
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Free Online Tools.
            <br />
            <span className="text-primary">
              Simple, Fast, Private.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground lg:mx-0">
            Compress images, merge PDFs, extract text and more — real tools
            that run right in your browser. No sign-up, no file uploads to a
            server unless clearly stated.
          </p>

          <div className="mx-auto mt-8 max-w-xl lg:mx-0">
            <SearchBar variant="hero" autoFocus={false} />
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
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

          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground lg:justify-start">
            {trustPoints.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-2">
                <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="relative mx-auto w-full max-w-lg">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3">
                <Sparkles className="size-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  All-in-One Toolkit
                </h2>
                <p className="text-sm text-muted-foreground">
                  Everything you need, in one place.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🖼️", title: "Image Tools", desc: "Compress, resize & convert" },
                { icon: "📄", title: "PDF Tools", desc: "Merge, split & organize" },
                { icon: "📝", title: "Text Extractor", desc: "Extract text from images" },
                { icon: "⚡", title: "Developer Tools", desc: "Format, encode & debug" },
              ].map((tool) => (
                <div
                  key={tool.title}
                  className="rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/50"
                >
                  <span className="text-2xl">{tool.icon}</span>
                  <h3 className="mt-3 font-semibold">{tool.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {tool.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl bg-primary/5 p-4 text-sm">
              <Lock className="size-4 shrink-0 text-primary" />
              <span>Private processing. No account required.</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
