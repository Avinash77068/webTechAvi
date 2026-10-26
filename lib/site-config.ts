export const siteConfig = {
  name: "TechSutra",
  tagline: "Free Online Tools. Simple, Fast, Private.",
  description:
    "Free online tools for images, PDFs, documents, video and audio. Compress, convert, merge, edit and extract text. Most tools run in your browser, with no sign-up required.",
  url: "https://www.techsutra.online",
  contactEmail: "webtechavi0@gmail.com",
  ogImage: "/logo.png",
  nav: [
    { label: "Image Tools", href: "/tools/category/image" },
    { label: "PDF Tools", href: "/tools/category/pdf" },
    { label: "Document Tools", href: "/tools/category/document" },
    { label: "Video & Audio", href: "/tools/category/video-audio" },
  ],
  footerLinks: {
    product: [
      { label: "All Tools", href: "/tools" },
      { label: "Merge PDF", href: "/tools/merge-pdf" },
      { label: "Compress PDF", href: "/tools/compress-pdf" },
      { label: "Image Compressor", href: "/tools/image-compressor" },
      { label: "Image to Text (OCR)", href: "/tools/image-to-text" },
      { label: "Image to PDF", href: "/tools/image-to-pdf" },
      { label: "Word to PDF", href: "/tools/word-to-pdf" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
