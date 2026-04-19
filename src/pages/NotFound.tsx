import { Link } from "react-router-dom";
import { Home, ArrowRight } from "lucide-react";
import PageShell from "@/components/PageShell";
import { useSeo } from "@/hooks/use-seo";

const NotFound = () => {
  useSeo({
    title: "Page not found",
    description: "The page you're looking for doesn't exist.",
    path: "/404",
    noIndex: true,
  });

  return (
    <PageShell>
      <div className="container mx-auto px-6 py-20 flex flex-col items-center text-center">
        <div className="font-heading text-8xl md:text-9xl font-bold gradient-text">404</div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold mt-6">Page not found</h1>
        <p className="text-muted-foreground mt-3 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            <Home size={18} /> Back to home
          </Link>
          <Link
            to="/case-studies"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border font-semibold hover:bg-secondary transition-colors"
          >
            View our work <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </PageShell>
  );
};

export default NotFound;
