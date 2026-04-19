export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readingTime: string;
  tags: string[];
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-choose-a-web-development-agency",
    title: "How to Choose the Right Web Development Agency in 2026",
    excerpt:
      "Nine questions that separate serious agencies from order-takers — and the answers you should expect.",
    author: "Avinash Shrivastav",
    date: "2026-04-02",
    readingTime: "7 min",
    tags: ["Hiring", "Agency"],
    content: `Choosing a web development agency is one of the highest-leverage decisions for any growing business. The wrong pick costs you months and six-figure budgets; the right one compounds for years. Here are the nine questions we tell prospects to ask *any* agency — including us.

## 1. Who on your team will actually write my code?
Beware of the senior-sales-bait-and-switch. Ask for the GitHub handles of the engineers who will ship your project. Agencies that hide their dev team usually outsource to juniors.

## 2. Can I see three production sites you shipped in the last year?
Not mockups. Real, live, load-tested sites — with the URLs.

## 3. What is your weekly demo cadence?
Agencies that show progress weekly finish on time. Agencies that go dark for a month rarely do.

## 4. How do you handle scope changes?
"Change requests will be billed at our hourly rate" is the wrong answer if there's no written scope to compare against. Insist on a scope-locked SOW.

## 5. What's in your standard testing setup?
Unit tests, E2E (Playwright/Cypress), Lighthouse budgets, and type-safety. If the answer is "we test by clicking around," walk.

## 6. Who owns the code, the Figma, and the domain?
You do. Get it in writing.

## 7. What do you use for project management?
Linear, Jira, ClickUp — fine. WhatsApp and email-only — red flag.

## 8. What does post-launch look like?
Every shipped project has bugs in the first 30 days. A warranty period + optional maintenance plan is standard.

## 9. What's the honest downside of working with you?
Ask this last. You're looking for self-awareness. "We're a good fit for projects over 3 months, not 1-week landing pages" is a great answer.

At ${"TechSutra"} we publish our SOW template and past case studies up front — the answer to every one of these questions is on our site, not behind a sales call.`,
  },
  {
    slug: "react-vs-nextjs-for-business-websites",
    title: "React vs Next.js for Business Websites: What We Actually Recommend",
    excerpt:
      "SPAs look great in demos and tank in search results. Here's when to use Next.js and when plain React is fine.",
    author: "Amit Kumar Yadav",
    date: "2026-03-18",
    readingTime: "9 min",
    tags: ["React", "Next.js", "SEO"],
    content: `Short answer: if your website needs to rank on Google, use Next.js. If it's an internal tool or authenticated app, plain React (Vite) is faster to build and cheaper to host.

## Why SPAs hurt SEO
Google *can* index client-rendered content — but crawl budgets are real, Core Web Vitals punish heavy JS, and social preview cards (Open Graph) fail without server-rendered meta tags. Every SPA site we audit is leaking organic traffic.

## When Next.js is the right call
- Marketing sites, blogs, and e-commerce
- Anything you want to rank
- Sites with dynamic Open Graph previews
- Edge-cached landing pages with personalisation

## When plain React (Vite) wins
- Admin dashboards
- Internal tools
- Authenticated-only SaaS product UIs
- Prototypes and MVPs where time-to-first-demo > SEO

## The hybrid pattern we recommend
A Next.js marketing front-end (\`/\`, \`/pricing\`, \`/blog\`) and a React SPA for the authenticated app (\`app.yoursite.com\`). Best of both: great SEO on the pages that need it, lean bundle on the pages that don't.`,
  },
  {
    slug: "website-cost-breakdown-india-2026",
    title: "How Much Does a Website Actually Cost in India (2026 Breakdown)",
    excerpt:
      "We open our pricing sheet and explain every line item — from Figma to domain to ongoing maintenance.",
    author: "Neha Joshi",
    date: "2026-02-27",
    readingTime: "6 min",
    tags: ["Pricing", "Business"],
    content: `There's no single answer — but here are the real ranges for quality work in 2026.

## Landing page (1–5 pages)
₹15,000 – ₹60,000. Simple design, one CMS block, contact form. 1–2 weeks.

## Business website (5–15 pages + blog)
₹50,000 – ₹2,00,000. Custom design, CMS, SEO setup, basic integrations. 3–5 weeks.

## E-commerce store
₹1,00,000 – ₹5,00,000. Shopify theme customisation on the low end; fully custom Next.js + Stripe on the high end.

## Custom web app / SaaS MVP
₹3,00,000 – ₹15,00,000+. Auth, payments, dashboards, backend, hosting, CI/CD. 8–16 weeks.

## What's actually in that number
| Line item | % of total |
|---|---|
| Design (wireframes, UI, revisions) | 20% |
| Frontend development | 35% |
| Backend / integrations | 25% |
| QA, SEO, launch | 10% |
| Project management | 10% |

## Hidden costs to budget for
- Domain + hosting: ₹1,500 – ₹15,000/yr
- SSL, CDN, email: usually free (Cloudflare + Zoho)
- Copywriting: ₹10,000 – ₹80,000 if outsourced
- Stock photography / illustrations: ₹5,000 – ₹30,000
- Maintenance: 10–15% of build cost per year

If an agency quotes less than ₹15,000 for a "website," ask what's missing. Usually it's SEO, testing, and aftercare.`,
  },
];
