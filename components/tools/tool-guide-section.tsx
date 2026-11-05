import { getToolGuide } from "@/lib/tool-guides";

export function ToolGuideSection({ slug, name }: { slug: string; name: string }) {
  const guide = getToolGuide(slug);
  if (!guide) return null;

  return (
    <section aria-labelledby="about-tool-heading">
      <h2 id="about-tool-heading" className="text-xl font-semibold">
        About the {name}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">
        {guide.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="font-semibold">Common uses</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            {guide.useCases.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Tips for best results</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            {guide.tips.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
