import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/80">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-10">
          <div>
            <Brand />
            <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
              Free online tools for everyday work. Simple to use, fast to run, and built with your privacy in mind.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-foreground">Popular tools</h2>
            <ul className="mt-3 space-y-2">
              {siteConfig.footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-foreground">Company</h2>
            <ul className="mt-3 space-y-2">
              {siteConfig.footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={`mailto:${siteConfig.contactEmail}`} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  {siteConfig.contactEmail}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-foreground">Legal</h2>
            <ul className="mt-3 space-y-2">
              {siteConfig.footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 border-t border-border/80 pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear().toString()} {siteConfig.name}. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <LockKeyhole className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
            Most files stay on your device while tools run.
          </p>
        </div>
      </div>
    </footer>
  );
}
