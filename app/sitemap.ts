import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getAvailableTools } from "@/lib/tools-registry";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/tools", "/about", "/contact", "/privacy", "/terms"].map(
    (path) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: new Date(),
    })
  );

  const toolRoutes = getAvailableTools().map((tool) => ({
    url: `${siteConfig.url}/tools/${tool.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...toolRoutes];
}
