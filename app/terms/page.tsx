import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `The terms for using ${siteConfig.name}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Terms of Use</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: October 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <section>
          <h2 className="text-xl font-semibold text-foreground">Using the tools</h2>
          <p className="mt-3">
            {siteConfig.name} provides free tools for working with images, PDFs, documents,
            video and audio. You're responsible for the files you process and for having the
            right to use and modify them.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">No warranty</h2>
          <p className="mt-3">
            Tools are provided "as is." While we test each tool before publishing it, browser
            environments vary, and we can't guarantee a specific result, speed, or compatibility
            on every device. Always keep a copy of your original file before processing it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Acceptable use</h2>
          <p className="mt-3">
            Don't use {siteConfig.name} to process content you don't have the rights to, to
            attempt to bypass another service's access controls or DRM, or to abuse the site's
            infrastructure (for example, automated scraping or denial-of-service attempts).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Advertising</h2>
          <p className="mt-3">
            {siteConfig.name} is supported by advertising. We don't run ads that impersonate
            download buttons, and we reserve ad space to avoid disrupting the upload, processing
            or download controls of any tool.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Changes</h2>
          <p className="mt-3">
            We may update these terms as the site evolves. Material changes will update the "Last
            updated" date above.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Contact</h2>
          <p className="mt-3">
            Questions? Email{" "}
            <a href={`mailto:${siteConfig.contactEmail}`} className="font-medium text-primary hover:underline">
              {siteConfig.contactEmail}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
