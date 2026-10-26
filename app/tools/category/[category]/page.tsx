import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/page-metadata";
import { Breadcrumbs } from "@/components/tools/breadcrumbs";
import { ToolCard } from "@/components/tools/tool-card";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site-config";
import { categoryMeta, getToolsByCategory, type ToolCategory } from "@/lib/tools-registry";

const categoryCopy: Record<ToolCategory, { title: string; h1: string; description: string }> = {
  image: {
    title: "Free Online Image Tools – Compress, Resize, Convert & Crop",
    h1: "Free Online Image Tools",
    description:
      "Compress, resize, convert, crop and edit images, or extract text with OCR. Free image tools that run in your browser with no sign-up.",
  },
  pdf: {
    title: "Free Online PDF Tools – Merge, Split, Compress & Edit",
    h1: "Free Online PDF Tools",
    description:
      "Merge, split, compress, rotate, edit and sign PDF files, or convert them to images and text. Free PDF tools that run in your browser.",
  },
  document: {
    title: "Free Online Document Tools – DOCX, TXT & CSV Editors",
    h1: "Free Online Document Tools",
    description:
      "Edit DOCX, TXT and CSV files, and convert Word documents to PDF. Free document tools that run in your browser with no sign-up.",
  },
  "video-audio": {
    title: "Free Online Video & Audio Tools – Trim, Convert & Extract",
    h1: "Free Online Video & Audio Tools",
    description:
      "Trim and convert video, or extract audio as MP3 from video files. Free tools that process files locally in your browser.",
  },
};

function isCategory(value: string): value is ToolCategory {
  return value in categoryMeta;
}

export function generateStaticParams() {
  return Object.keys(categoryMeta).map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps<"/tools/category/[category]">) {
  const { category } = await params;
  if (!isCategory(category)) return {};
  const copy = categoryCopy[category];
  return createPageMetadata({
    title: copy.title,
    description: copy.description,
    path: `/tools/category/${category}`,
  });
}

export default async function CategoryPage({ params }: PageProps<"/tools/category/[category]">) {
  const { category } = await params;
  if (!isCategory(category)) notFound();

  const copy = categoryCopy[category];
  const categoryTools = getToolsByCategory(category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "All Tools", item: `${siteConfig.url}/tools` },
          {
            "@type": "ListItem",
            position: 3,
            name: categoryMeta[category].label,
            item: `${siteConfig.url}/tools/category/${category}`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: copy.h1,
        description: copy.description,
        url: `${siteConfig.url}/tools/category/${category}`,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={[{ label: "All Tools", href: "/tools" }, { label: categoryMeta[category].label }]} />
      <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">{copy.h1}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">{copy.description}</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categoryTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
