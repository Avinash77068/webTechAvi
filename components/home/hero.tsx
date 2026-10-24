import Link from "next/link";
import {
  ArrowRight,
  FileImage,
  FileText,
  LockKeyhole,
  ScanText,
  ShieldCheck,
  Sparkles,
  Video,
  Zap,
} from "lucide-react";
import { SearchBar } from "@/components/layout/search-bar";
import { categoryMeta, getAvailableTools } from "@/lib/tools-registry";

const toolkitCards = [
  {
    label: categoryMeta.image.label,
    description: "Compress, resize & convert images",
    href: "/tools?category=image",
    icon: FileImage,
    iconClass: "bg-emerald-400/15 text-emerald-300",
  },
  {
    label: categoryMeta.pdf.label,
    description: "Merge, split & organize PDFs",
    href: "/tools?category=pdf",
    icon: FileText,
    iconClass: "bg-rose-400/15 text-rose-300",
  },
  {
    label: categoryMeta.document.label,
    description: "Edit and convert documents",
    href: "/tools?category=document",
    icon: ScanText,
    iconClass: "bg-violet-400/15 text-violet-300",
  },
  {
    label: categoryMeta["video-audio"].label,
    description: "Trim video & extract audio",
    href: "/tools?category=video-audio",
    icon: Video,
    iconClass: "bg-cyan-400/15 text-cyan-300",
  },
];

const trustPoints = [
  { icon: Zap, label: "No sign-up required", detail: "Start using tools instantly" },
  { icon: LockKeyhole, label: "Browser processing", detail: "For most tools, no upload" },
  { icon: ShieldCheck, label: "Free to use", detail: "Tools for everyday work" },
];

export function Hero() {
  return (
    <section className="hero-section">
      <div className="relative mx-auto grid max-w-7xl items-center gap-11 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14 lg:px-8 lg:py-[4.5rem]">
        <div className="relative z-10 text-center lg:text-left">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/[0.08] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-sky-200">
            <Sparkles className="size-3.5 text-sky-300" aria-hidden="true" />
            100% free online tools
          </div>

          <h1 className="mx-auto max-w-3xl text-[2.65rem] leading-[1.08] font-bold tracking-[-0.055em] text-balance text-white sm:text-5xl lg:mx-0 lg:text-[3.9rem]">
            Free Online Tools.
            <br />
            <span className="hero-title-accent">Simple, Fast, Private.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-[39rem] text-base leading-7 text-slate-300 sm:text-[1.05rem] lg:mx-0">
            Compress images, merge PDFs, extract text and more. Most tools run right in your browser, with no sign-up and no upload unless a tool clearly says otherwise.
          </p>

          <div className="mx-auto mt-7 max-w-[39rem] lg:mx-0">
            <SearchBar variant="hero" autoFocus={false} />
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
            {Object.entries(categoryMeta).map(([slug, meta]) => (
              <Link
                key={slug}
                href={`/tools?category=${slug}`}
                className="rounded-full border border-slate-600/80 bg-slate-950/25 px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-sky-400/70 hover:bg-sky-400/10 hover:text-white sm:text-sm"
              >
                {meta.label}
              </Link>
            ))}
            <Link
              href="/tools"
              className="rounded-full border border-slate-600/80 bg-slate-950/25 px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-sky-400/70 hover:bg-sky-400/10 hover:text-white sm:text-sm"
            >
              All Tools
            </Link>
          </div>

          <div className="mx-auto mt-8 grid max-w-[42rem] grid-cols-1 gap-3 text-left sm:grid-cols-3 sm:gap-2 lg:mx-0">
            {trustPoints.map(({ icon: Icon, label, detail }) => (
              <div key={label} className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-slate-950/25 px-3 py-2.5 sm:border-transparent sm:bg-transparent sm:px-0">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sky-400/10 text-sky-300">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-slate-100 sm:text-[0.7rem]">{label}</span>
                  <span className="mt-0.5 block text-[0.68rem] text-slate-400">{detail}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[35rem] lg:mr-0">
          <div className="hero-toolkit relative p-4 sm:p-6">
            <div className="mb-5 flex items-center gap-3 sm:mb-6">
              <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-blue-950/40">
                <Sparkles className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">All-in-One Toolkit</h2>
                <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">Everything you need, in one place.</p>
              </div>
              <span className="ml-auto hidden rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[0.65rem] font-semibold text-emerald-200 sm:inline-flex">
                {getAvailableTools().length} tools
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {toolkitCards.map(({ label, description, href, icon: Icon, iconClass }) => (
                <Link key={label} href={href} className="hero-category-card group flex min-h-[8.2rem] flex-col p-3.5 sm:min-h-[8.7rem] sm:p-4">
                  <span className={`flex size-9 items-center justify-center rounded-xl ${iconClass}`}>
                    <Icon className="size-[1.1rem]" aria-hidden="true" />
                  </span>
                  <span className="mt-3 flex w-full items-center justify-between gap-1 text-sm font-semibold text-white sm:text-[0.95rem]">
                    {label}
                    <ArrowRight className="size-4 shrink-0 text-sky-300 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                  <span className="mt-1 text-[0.7rem] leading-4 text-slate-400 sm:text-xs">{description}</span>
                </Link>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-xl border border-blue-400/20 bg-blue-500/[0.1] px-3.5 py-3 sm:mt-5 sm:items-center sm:px-4">
              <LockKeyhole className="mt-0.5 size-4 shrink-0 text-sky-300 sm:mt-0" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold text-sky-100 sm:text-sm">No account required.</p>
                <p className="mt-0.5 text-[0.68rem] leading-4 text-slate-400">Processing details are clear on every tool.</p>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-5 -top-5 -z-10 hidden size-24 rounded-3xl border border-sky-300/15 bg-sky-300/[0.06] rotate-12 blur-[1px] sm:block" />
          <div className="pointer-events-none absolute -bottom-7 -left-7 -z-10 hidden size-20 rounded-full bg-blue-500/15 blur-2xl sm:block" />
        </div>
      </div>
    </section>
  );
}
