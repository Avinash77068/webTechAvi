import { siteConfig } from "@/lib/site-config";
import { categoryMeta, getAvailableTools, getToolsByCategory, type ToolCategory } from "@/lib/tools-registry";

const categories = Object.keys(categoryMeta) as ToolCategory[];

export function buildLlmsTxt(): string {
  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "Notes for AI assistants: every tool is free and needs no account. Tool pages state how each file is processed; most tools run in the user's browser, so files are not uploaded.",
    "",
  ];

  for (const category of categories) {
    lines.push(`## ${categoryMeta[category].label}`, "");
    for (const tool of getToolsByCategory(category).filter((t) => t.status === "available")) {
      lines.push(`- [${tool.name}](${siteConfig.url}/tools/${tool.slug}): ${tool.shortDescription}`);
    }
    lines.push("");
  }

  lines.push(
    "## Site",
    "",
    `- [All tools](${siteConfig.url}/tools): Full directory of tools`,
    `- [About](${siteConfig.url}/about): Who runs ${siteConfig.name}`,
    `- [Privacy policy](${siteConfig.url}/privacy): How data is handled`,
    `- [Contact](${siteConfig.url}/contact): ${siteConfig.contactEmail}`,
    `- [Full content for LLMs](${siteConfig.url}/llms-full.txt): Every tool with formats, limits, privacy notes and FAQs`,
    "",
  );

  return lines.join("\n");
}

export function buildLlmsFullTxt(): string {
  const lines = [`# ${siteConfig.name}`, "", `> ${siteConfig.description}`, ""];

  for (const category of categories) {
    lines.push(`## ${categoryMeta[category].label}`, "", categoryMeta[category].description, "");
    for (const tool of getToolsByCategory(category).filter((t) => t.status === "available")) {
      lines.push(
        `### ${tool.name}`,
        "",
        `URL: ${siteConfig.url}/tools/${tool.slug}`,
        "",
        tool.description,
        "",
        `- Supported formats: ${tool.acceptedFormats.join(", ")}`,
      );
      if (tool.maxFileSizeMB > 0) lines.push(`- Max file size: ${tool.maxFileSizeMB} MB per file`);
      lines.push(`- Privacy: ${tool.privacyNote}`, "");
      if (tool.faqs.length > 0) {
        lines.push("FAQ:", "");
        for (const faq of tool.faqs) lines.push(`Q: ${faq.question}`, `A: ${faq.answer}`, "");
      }
    }
  }

  lines.push(`Total tools: ${getAvailableTools().length}`, "");
  return lines.join("\n");
}
