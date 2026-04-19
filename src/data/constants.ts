
export const navLinks = [
  { label: "Home", href: "/#home", internal: true },
  { label: "Services", href: "/#services", internal: true },
  { label: "Work", href: "/#portfolio", internal: true },
  { label: "Process", href: "/#process", internal: true },
  { label: "Pricing", href: "/#pricing", internal: true },
  { label: "FAQ", href: "/#faq", internal: true },
  { label: "Contact", href: "/#contact", internal: true },
];

export const stats = [
  { num: "100+", label: "Projects Delivered" },
  { num: "50+", label: "Happy Clients" },
  { num: "8+", label: "Years Experience" },
  { num: "15+", label: "Team Members" },
];

export const contactInfo = [
  { icon: "Mail", label: "Email", value: "info@techsutra.com", href: `mailto:info@techsutra.com` },
  { icon: "Phone", label: "Phone", value: "+91 77068 97675", href: `tel:+917706897675` },
  { icon: "MapPin", label: "Location", value: "Noida, Uttar Pradesh, India", href: null },
];

export const brandInfo = {
  name: "TechSutra",
  domain: "techsutra.com",
  siteUrl: "https://techsutra.com",
  tagline: "INNOVATE • ELEVATE",
  description:
    "TechSutra is a web development agency building high-performance websites, web apps, and e-commerce platforms for ambitious businesses.",
  mission:
    "To empower businesses with cutting-edge technology and innovative solutions that drive growth.",
  vision:
    "To be the leading technology partner for businesses seeking digital transformation.",
  email: "info@techsutra.com",
  phonePrimary: "+917706897675",
  phoneSecondary: "+919911936666",
  phoneDisplay: "+91 77068 97675",
  whatsappNumber: "917706897675",
  location: "Noida, Uttar Pradesh, India",
  calendlyUrl: "https://calendly.com/techsutra/discovery-call",
  social: {
    linkedin: "https://www.linkedin.com/company/techsutra",
    github: "https://github.com/techsutra",
    twitter: "https://twitter.com/techsutra",
    instagram: "https://instagram.com/techsutra",
  },
} as const;

export const brand = brandInfo;
