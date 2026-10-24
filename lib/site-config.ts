export const siteConfig = {
  name: "TechSutra",
  tagline: "Free Online Tools. Simple, Fast, Private.",
  description:
    "Free online tools for images, PDFs, documents, video and audio. Compress, convert, merge, edit and extract text — all processed in your browser, no sign-up required.",
  url: "https://techsutra.online",
  contactEmail: "hello@techsutra.online",
  ogImage: "/og-image.png",
  nav: [
    { label: "Image Tools", href: "/tools?category=image" },
    { label: "PDF Tools", href: "/tools?category=pdf" },
    { label: "Document Tools", href: "/tools?category=document" },
    { label: "Video & Audio", href: "/tools?category=video-audio" },
  ],
  footerLinks: {
    product: [
      { label: "All Tools", href: "/tools" },
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
