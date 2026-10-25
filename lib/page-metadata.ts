import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
}: PageMetadataOptions): Metadata {
  const socialTitle = `${title} | ${siteConfig.name}`;
  const image = {
    url: siteConfig.ogImage,
    alt: `${siteConfig.name} — ${siteConfig.tagline}`,
  };

  return {
    title,
    description,
    keywords: [...new Set([...keywords, "free online tools", siteConfig.name])],
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: siteConfig.name,
      title: socialTitle,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image],
    },
  };
}
