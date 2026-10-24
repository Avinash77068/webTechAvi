import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: `Why ${siteConfig.name} exists and how it's built.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">About {siteConfig.name}</h1>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <p>
          {siteConfig.name} started from a simple frustration: most "free" online file tools
          either don't actually work, bury the real tool behind a paywall, or quietly upload
          your files somewhere you can't see. We wanted something that just works, is honest
          about what it does, and doesn't ask for your email address first.
        </p>
        <p>
          Wherever practical, tools run entirely in your browser using modern Web APIs and
          well-established open-source libraries — so your files don't need to leave your
          device. Each tool page says plainly what it supports, what its limits are, and what
          happens to your data.
        </p>
        <p>
          The site is funded by advertising, not subscriptions. We'd rather ship a smaller
          number of tools that genuinely work than a long list of buttons that don't.
        </p>
        <p>
          Have feedback or found a bug? We'd like to hear about it — see the{" "}
          <Link href="/contact" className="font-medium text-primary hover:underline">
            Contact
          </Link>{" "}
          page.
        </p>
      </div>
    </div>
  );
}
