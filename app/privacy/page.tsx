import { createPageMetadata } from "@/lib/page-metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.name} handles your files and data.`,
  path: "/privacy",
  keywords: ["TechSutra privacy policy", "online file privacy"],
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: October 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <section>
          <h2 className="text-xl font-semibold text-foreground">How your files are processed</h2>
          <p className="mt-3">
            Most tools on {siteConfig.name} — including every image tool and the YouTube
            Thumbnail Viewer — run entirely inside your browser using built-in Web APIs
            (Canvas, the File API) and open-source libraries loaded as JavaScript/WebAssembly.
            The file you select is never transmitted to our servers for these tools.
          </p>
          <p className="mt-3">
            The Image to Text (OCR) tool also runs locally, using Tesseract.js. The first time
            you use it, your browser downloads the OCR engine and the language data you select
            (English or Hindi) from a public CDN — this is the OCR software itself, not your
            image or any extracted text.
          </p>
          <p className="mt-3">
            If a future tool genuinely requires server-side processing, its page will say so
            explicitly and describe exactly what is sent and why. We do not label a tool as
            private or local-only unless its actual network behavior supports that claim.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">What we don't do</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>We don't upload the content of your files to our servers for local tools.</li>
            <li>We don't send OCR text, document content, or file contents to analytics providers.</li>
            <li>We don't require an account, so we don't collect sign-up information.</li>
            <li>We don't sell personal data.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Local storage and cookies</h2>
          <p className="mt-3">
            We use your browser's local storage for small preferences, such as your light/dark
            theme choice and, once advertising is active, your ad-consent choice. These never
            contain your file contents.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Advertising</h2>
          <p className="mt-3">
            {siteConfig.name} is funded by advertising. Advertising is currently disabled while
            we finalize a provider and the required approvals. Once enabled, this page will be
            updated to name the provider, describe what data it processes, and link to its own
            privacy policy, along with a consent control for personalized ads.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Third-party content</h2>
          <p className="mt-3">
            The YouTube Thumbnail Viewer displays thumbnail images hosted by YouTube
            (img.youtube.com) based on the video URL you paste. Loading these images is a
            request to YouTube's servers, governed by YouTube's own privacy policy — we don't
            control or see that request.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Contact</h2>
          <p className="mt-3">
            Questions about this policy? Email us at{" "}
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
