import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageShell from "@/components/PageShell";
import { useSeo } from "@/hooks/use-seo";
import { caseStudies } from "@/data/caseStudies";

const CaseStudies = () => {
  useSeo({
    title: "Case Studies — real results from real clients",
    description:
      "In-depth case studies of the web development projects we've shipped — with measurable conversion, performance, and revenue outcomes.",
    path: "/case-studies",
  });

  return (
    <PageShell>
      <div className="container mx-auto px-6 max-w-5xl">
        <header className="mb-14 text-center">
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Case Studies</span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mt-3">
            Real Clients. <span className="gradient-text">Real Results.</span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            The full story behind some of our favourite projects — numbers, decisions, and tradeoffs included.
          </p>
        </header>

        <div className="grid gap-8">
          {caseStudies.map((cs) => (
            <Link
              key={cs.slug}
              to={`/case-studies/${cs.slug}`}
              className="group glass rounded-2xl overflow-hidden hover:border-primary/50 transition-all grid md:grid-cols-5"
            >
              <div className="md:col-span-2 aspect-video md:aspect-auto overflow-hidden">
                <img
                  src={cs.heroImage}
                  alt={cs.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="md:col-span-3 p-8">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  {cs.industry} · {cs.year}
                </div>
                <h2 className="font-heading text-2xl font-semibold group-hover:text-primary transition-colors">
                  {cs.title}
                </h2>
                <p className="text-muted-foreground mt-3 leading-relaxed">{cs.tagline}</p>

                <div className="flex flex-wrap gap-4 mt-5">
                  {cs.results.slice(0, 3).map((r) => (
                    <div key={r.label}>
                      <div className="font-heading text-xl font-bold gradient-text">{r.value}</div>
                      <div className="text-xs text-muted-foreground">{r.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 inline-flex items-center gap-2 text-primary text-sm font-medium">
                  Read the full story <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
};

export default CaseStudies;
