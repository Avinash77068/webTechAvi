import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { PopularTools } from "@/components/home/popular-tools";
import { CategorySections } from "@/components/home/category-sections";
import { HowItWorks } from "@/components/home/how-it-works";
import { FaqSection } from "@/components/tools/faq-section";
import { AdSlot } from "@/components/ads/ad-slot";
import { homeFaqs } from "@/lib/site-faqs";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <PopularTools />
      <CategorySections />
      <HowItWorks />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdSlot placement="homepage-leaderboard" />
      </div>
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <FaqSection faqs={homeFaqs} />
      </section>
    </>
  );
}
