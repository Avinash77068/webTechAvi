import type { ToolFaq } from "@/lib/tools-registry";

export const homeFaqs: ToolFaq[] = [
  {
    question: "Is TechSutra really free?",
    answer:
      "Yes. Every tool on TechSutra is free to use, with no usage limits tied to a paid plan. The site is supported by advertising rather than subscriptions.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No. There's no sign-up, login, or account requirement for any tool.",
  },
  {
    question: "Where does the file processing actually happen?",
    answer:
      "Most tools process your file entirely in your browser using built-in Web APIs (Canvas, WebAssembly) — your file isn't uploaded anywhere. Each tool page states this explicitly, and if a specific feature ever needs to use a server, that page says so clearly instead of assuming privacy by default.",
  },
  {
    question: "Why do some tools say \"Coming soon\"?",
    answer:
      "We'd rather ship a tool once it genuinely works end-to-end than publish a placeholder. Tools marked \"Coming soon\" are on the roadmap and not yet available.",
  },
  {
    question: "How does TechSutra make money if it's free?",
    answer:
      "Through advertising. We don't sell your files or data — there's nothing of yours to sell, since most processing never leaves your browser.",
  },
];
