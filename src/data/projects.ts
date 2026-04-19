import imgEcommerce from "@/assets/portfolio/ecommerce.jpg";
import imgRestaurant from "@/assets/portfolio/restaurant.jpg";
import imgSaas from "@/assets/portfolio/saas-dashboard.jpg";
import imgPortfolio from "@/assets/portfolio/portfolio.jpg";
import imgRealestate from "@/assets/portfolio/realestate.jpg";
import imgFitness from "@/assets/portfolio/fitness.jpg";
import imgBlog from "@/assets/portfolio/blog.jpg";
import imgSchool from "@/assets/portfolio/school.jpg";
import imgFood from "@/assets/portfolio/food-delivery.jpg";
import imgChat from "@/assets/portfolio/chat-app.jpg";
import imgJobs from "@/assets/portfolio/job-portal.jpg";
import imgTravel from "@/assets/portfolio/travel.jpg";
import imgNews from "@/assets/portfolio/news.jpg";
import imgInvoice from "@/assets/portfolio/invoice.jpg";
import imgSocial from "@/assets/portfolio/social-dashboard.jpg";

export interface Project {
  slug: string;
  title: string;
  category: string;
  img: string;
  summary: string;
  tags: string[];
  result?: string;
  hasCaseStudy?: boolean;
}

export const projects: Project[] = [
  {
    slug: "ecommerce-platform",
    title: "E-Commerce Platform",
    category: "E-Commerce",
    img: imgEcommerce,
    summary: "Headless Shopify storefront with custom checkout and loyalty program.",
    tags: ["Next.js", "Shopify", "Stripe"],
    result: "+42% conversion",
    hasCaseStudy: true,
  },
  {
    slug: "restaurant-website",
    title: "Restaurant Website",
    category: "Landing Page",
    img: imgRestaurant,
    summary: "Online menu, reservations, and local SEO for a fine-dining brand.",
    tags: ["React", "Tailwind", "Sanity CMS"],
  },
  {
    slug: "saas-dashboard",
    title: "SaaS Dashboard",
    category: "Web App",
    img: imgSaas,
    summary: "Analytics dashboard MVP for a B2B workflow-automation startup.",
    tags: ["React", "TypeScript", "Recharts"],
    result: "Shipped in 6 weeks",
    hasCaseStudy: true,
  },
  {
    slug: "portfolio-theme",
    title: "Portfolio Theme",
    category: "Personal",
    img: imgPortfolio,
    summary: "Animated portfolio template for creative professionals.",
    tags: ["React", "Framer Motion"],
  },
  {
    slug: "realestate-app",
    title: "Real Estate Platform",
    category: "Web App",
    img: imgRealestate,
    summary: "Property search + agent CRM with map-based filtering.",
    tags: ["Next.js", "Mapbox", "PostgreSQL"],
  },
  {
    slug: "fitness-tracker",
    title: "Fitness Tracker",
    category: "Mobile Web",
    img: imgFitness,
    summary: "PWA for workout logging with offline sync and streaks.",
    tags: ["React", "IndexedDB", "PWA"],
  },
  {
    slug: "blog-platform",
    title: "Blog Platform",
    category: "CMS",
    img: imgBlog,
    summary: "Multi-author publishing platform with newsletter and SEO built in.",
    tags: ["Next.js", "MDX", "Sanity"],
  },
  {
    slug: "school-mgmt",
    title: "School Management System",
    category: "Web App",
    img: imgSchool,
    summary: "Attendance, grades, fee collection, and parent portal.",
    tags: ["React", "Node.js", "PostgreSQL"],
  },
  {
    slug: "food-delivery",
    title: "Food Delivery App",
    category: "Web App",
    img: imgFood,
    summary: "Multi-restaurant ordering with live tracking and Razorpay.",
    tags: ["Next.js", "Node.js", "Razorpay"],
  },
  {
    slug: "chat-app",
    title: "Realtime Chat App",
    category: "Real-time",
    img: imgChat,
    summary: "Team chat with threads, file sharing, and presence.",
    tags: ["React", "Socket.io", "Redis"],
  },
  {
    slug: "job-portal",
    title: "Job Portal",
    category: "Web App",
    img: imgJobs,
    summary: "Job board with ATS, resume parsing, and employer dashboards.",
    tags: ["Next.js", "Prisma", "AWS"],
  },
  {
    slug: "travel-booking",
    title: "Travel Booking Site",
    category: "E-Commerce",
    img: imgTravel,
    summary: "Package search, itinerary builder, and secure checkout.",
    tags: ["Next.js", "Stripe", "Algolia"],
  },
  {
    slug: "news-aggregator",
    title: "News Aggregator",
    category: "Content",
    img: imgNews,
    summary: "Personalised news feed with topic subscriptions.",
    tags: ["React", "Node.js", "Redis"],
  },
  {
    slug: "invoice-generator",
    title: "Invoice Generator",
    category: "Tool",
    img: imgInvoice,
    summary: "PDF invoicing SaaS for freelancers and small agencies.",
    tags: ["Next.js", "PDF-lib", "Stripe"],
  },
  {
    slug: "social-dashboard",
    title: "Social Media Dashboard",
    category: "Analytics",
    img: imgSocial,
    summary: "Unified analytics for multi-channel social campaigns.",
    tags: ["React", "Recharts", "Node.js"],
  },
];
