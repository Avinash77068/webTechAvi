import { readFileSync, writeFileSync } from "node:fs";

const siteUrl = "https://www.techsutra.online";
const registry = readFileSync("lib/tools-registry.ts", "utf8");

const slugs = [];
for (const block of registry.split(/\n  \{\n/).slice(1)) {
  const slug = block.match(/slug: "([^"]+)"/)?.[1];
  const status = block.match(/status: "([^"]+)"/)?.[1];
  if (slug && status === "available") slugs.push(slug);
}

const categories = ["image", "pdf", "document", "video-audio"];
const paths = [
  { path: "", changefreq: "weekly", priority: "1.0" },
  { path: "/tools", changefreq: "weekly", priority: "0.9" },
  ...categories.map((c) => ({ path: `/tools/category/${c}`, changefreq: "weekly", priority: "0.8" })),
  ...slugs.map((s) => ({ path: `/tools/${s}`, changefreq: "monthly", priority: "0.8" })),
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.6" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (p) => `  <url>
    <loc>${siteUrl}${p.path}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);
console.log(`public/sitemap.xml written with ${paths.length} URLs`);
