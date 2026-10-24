import { ToolCard } from "@/components/tools/tool-card";
import type { ToolDefinition } from "@/lib/tools-registry";

export function RelatedTools({ tools }: { tools: ToolDefinition[] }) {
  if (tools.length === 0) return null;

  return (
    <section aria-labelledby="related-tools-heading">
      <h2 id="related-tools-heading" className="text-xl font-semibold">
        Related tools
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
