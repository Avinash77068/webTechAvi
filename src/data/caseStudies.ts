export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  industry: string;
  tagline: string;
  heroImage: string;
  duration: string;
  year: string;
  tech: string[];
  results: { label: string; value: string }[];
  challenge: string;
  solution: string;
  outcome: string;
}

import imgEcommerce from "@/assets/portfolio/ecommerce.jpg";
import imgSaas from "@/assets/portfolio/saas-dashboard.jpg";

export const caseStudies: CaseStudy[] = [
  {
    slug: "ecommerce-platform",
    title: "Rebuilding an e-commerce store for 42% higher conversions",
    client: "Urban Cart",
    industry: "D2C Fashion",
    tagline:
      "A headless Shopify rebuild that cut page weight by 60% and lifted conversion from 1.8% to 2.6%.",
    heroImage: imgEcommerce,
    duration: "7 weeks",
    year: "2025",
    tech: ["Next.js", "Shopify Hydrogen", "Stripe", "Algolia", "Vercel"],
    results: [
      { label: "Conversion rate", value: "+42%" },
      { label: "Mobile LCP", value: "4.1s → 1.3s" },
      { label: "Cart abandonment", value: "−28%" },
      { label: "Organic traffic (90d)", value: "+61%" },
    ],
    challenge:
      "Urban Cart's legacy Shopify theme was bloated — 3.2 MB of JS on mobile, Largest Contentful Paint over 4 seconds, and a checkout that reloaded four times. Conversion was stuck at 1.8% despite strong paid-ad spend.",
    solution:
      "We rebuilt the storefront as a headless Next.js app on Shopify Hydrogen, moved search to Algolia for instant filtering, and re-designed the checkout as a single-page flow. Images migrated to AVIF + lazy-loaded. A new product-recommendation widget was added at cart level.",
    outcome:
      "Within 30 days of launch, conversion climbed from 1.8% to 2.6%, and mobile LCP dropped to 1.3s (well inside Google's 'Good' threshold). Organic traffic grew 61% over 90 days from the Core Web Vitals gains alone. Urban Cart retained us on a maintenance + growth retainer after the build.",
  },
  {
    slug: "saas-dashboard",
    title: "Shipping a SaaS MVP in six weeks that raised seed funding",
    client: "FlowMetric",
    industry: "B2B SaaS",
    tagline:
      "An analytics dashboard MVP built in 6 weeks that helped close a $1.2M seed round.",
    heroImage: imgSaas,
    duration: "6 weeks",
    year: "2025",
    tech: ["React", "TypeScript", "Node.js", "PostgreSQL", "Recharts", "AWS"],
    results: [
      { label: "Time to MVP", value: "6 weeks" },
      { label: "Seed funding closed", value: "$1.2M" },
      { label: "Design-to-prod cycle", value: "2 days" },
      { label: "Pilot customers onboarded", value: "9" },
    ],
    challenge:
      "FlowMetric had 8 weeks before their next investor meeting and no product. Their founding team had domain expertise but no engineering bandwidth. They needed a working, demo-ready dashboard that could be shown to pilot customers — not a prototype.",
    solution:
      "We scoped a tight MVP: auth, one core data-ingestion pipeline, three dashboard views, and a billing placeholder. Daily standups, weekly Loom demos, and a shared Linear board kept alignment. We used proven building blocks (Clerk for auth, Stripe Checkout, AWS RDS) instead of inventing anything, so every hour went into the differentiated product surface.",
    outcome:
      "Shipped the MVP in 6 weeks with 9 pilot customers actively using it during the pitch. FlowMetric closed their $1.2M seed two weeks after the investor demo. We now run the engineering team as a retainer while their in-house hires ramp up.",
  },
];
