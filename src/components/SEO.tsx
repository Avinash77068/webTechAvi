import { Helmet } from "react-helmet-async";
import { brandInfo } from "@/data/constants";

interface SEOProps {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export function SEO({
  title,
  description = brandInfo.description,
  path = "/",
  image = `${brandInfo.siteUrl}/og-image.png`,
  type = "website",
  noIndex = false,
  keywords =const advancedKeywords = [
  // High Intent
  "web development company in India",
  "hire React developer India",
  "hire Next.js developer India",
  "SaaS product development company",
  "custom web application development services",
  "ecommerce website development company India",
  "UI UX design agency India",
  "full stack development services India",

  // Long Tail (Low competition)
  "cost of building SaaS product in India",
  "how to hire React developer for startup",
  "best tech stack for scalable web app",
  "how to build MVP for startup India",
  "affordable web development services for startups",
  "Next.js vs React for SEO",
  "custom ecommerce website vs Shopify",
  "web app development timeline and cost",

  // Problem Solving
  "why website is slow and how to fix",
  "how to improve website SEO performance",
  "how to optimize Next.js app for SEO",
  "best practices for frontend performance",
  "reduce website bounce rate",

  // Authority
  "modern web development trends",
  "future of SaaS development",
  "AI in web development",
  "headless CMS vs traditional CMS",
  "micro frontend architecture",

  // Local SEO
  "web development company in Noida",
  "software development agency in Delhi NCR",
  "best React developers in Noida",
  "SaaS development company in India",

  // Technical SEO
  "core web vitals optimization",
  "technical SEO audit services",
  "website speed optimization agency",
  "lighthouse performance optimization",

  // Branding
  "TechSutra web development",
  "TechSutra SaaS development",
  "TechSutra React agency",
  "TechSutra portfolio"
],
  author = brandInfo.name,
  publishedTime,
  modifiedTime,
}: SEOProps) {
  const fullTitle = title.includes(brandInfo.name) ? title : `${title} | ${brandInfo.name}`;
  const canonicalUrl = `${brandInfo.siteUrl}${path}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="author" content={author} />
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={brandInfo.name} />
      <meta property="og:locale" content="en_US" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content={`@${brandInfo.name}`} />

      {/* Additional SEO */}
      <meta name="theme-color" content="#6366f1" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="IN-UP" />
      <meta name="geo.placename" content="Noida" />
      <meta name="geo.position" content="28.5355;77.3910" />
      <meta name="ICBM" content="28.5355, 77.3910" />

      {/* Business Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: brandInfo.name,
          description: brandInfo.description,
          url: brandInfo.siteUrl,
          logo: `${brandInfo.siteUrl}/logo.png`,
          image: image,
          telephone: brandInfo.phoneDisplay,
          email: brandInfo.email,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Noida",
            addressRegion: "Uttar Pradesh",
            addressCountry: "IN",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: "28.5355",
            longitude: "77.3910",
          },
          sameAs: [
            brandInfo.social.linkedin,
            brandInfo.social.github,
            brandInfo.social.twitter,
            brandInfo.social.instagram,
          ],
          priceRange: "₹₹",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "50",
          },
        })}
      </script>

      {/* Breadcrumb Schema */}
      {path !== "/" && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: brandInfo.siteUrl,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: title,
                item: canonicalUrl,
              },
            ],
          })}
        </script>
      )}

      {/* Website Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: brandInfo.name,
          url: brandInfo.siteUrl,
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${brandInfo.siteUrl}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        })}
      </script>
    </Helmet>
  );
}
