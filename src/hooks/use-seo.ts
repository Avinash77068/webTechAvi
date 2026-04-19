import { useEffect } from "react";
import { brand } from "@/data/constants";

interface SeoOptions {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

const ensureMeta = (selector: string, attrs: Record<string, string>) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    document.head.appendChild(el);
  }
  return el;
};

const setMetaContent = (selector: string, attrs: Record<string, string>, content: string) => {
  const el = ensureMeta(selector, attrs);
  el.setAttribute("content", content);
};

const setCanonical = (href: string) => {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};

export function useSeo({
  title,
  description = brand.description,
  path = "/",
  image = `${brand.siteUrl}/og-image.png`,
  type = "website",
  noIndex = false,
}: SeoOptions) {
  useEffect(() => {
    const fullTitle = title.includes(brand.name) ? title : `${title} | ${brand.name}`;
    document.title = fullTitle;

    setMetaContent('meta[name="description"]', { name: "description" }, description);
    setMetaContent('meta[name="robots"]', { name: "robots" }, noIndex ? "noindex,nofollow" : "index,follow");

    setMetaContent('meta[property="og:title"]', { property: "og:title" }, fullTitle);
    setMetaContent('meta[property="og:description"]', { property: "og:description" }, description);
    setMetaContent('meta[property="og:type"]', { property: "og:type" }, type);
    setMetaContent('meta[property="og:url"]', { property: "og:url" }, `${brand.siteUrl}${path}`);
    setMetaContent('meta[property="og:image"]', { property: "og:image" }, image);

    setMetaContent('meta[name="twitter:title"]', { name: "twitter:title" }, fullTitle);
    setMetaContent('meta[name="twitter:description"]', { name: "twitter:description" }, description);
    setMetaContent('meta[name="twitter:image"]', { name: "twitter:image" }, image);

    setCanonical(`${brand.siteUrl}${path}`);
  }, [title, description, path, image, type, noIndex]);
}
