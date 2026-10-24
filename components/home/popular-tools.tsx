import { ToolCard } from "@/components/tools/tool-card";
import { getPopularTools } from "@/lib/tools-registry";

export function PopularTools() {
  const popular = getPopularTools();
  if (popular.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Popular tools</h2>
      <p className="mt-2 text-muted-foreground">Jump straight into the tools people use most.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {popular.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
