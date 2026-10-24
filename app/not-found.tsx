import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/tools/tool-card";
import { getPopularTools } from "@/lib/tools-registry";

export default function NotFound() {
  const popular = getPopularTools().slice(0, 4);

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Compass className="size-8" aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you're looking for doesn't exist or may have moved. Try one of the popular
        tools below, or head back home.
      </p>
      <div className="mt-6 flex gap-3">
        <Button nativeButton={false} render={<Link href="/" />}>
          <Home aria-hidden="true" />
          Back to home
        </Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/tools" />}>
          Browse all tools
        </Button>
      </div>

      {popular.length > 0 && (
        <div className="mt-14 grid w-full gap-4 text-left sm:grid-cols-2">
          {popular.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
