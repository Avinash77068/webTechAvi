import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import PageShell from "@/components/PageShell";
import CalendlyDialog from "@/components/CalendlyDialog";
import { useSeo } from "@/hooks/use-seo";
import { caseStudies } from "@/data/caseStudies";

const CaseStudy = () => {
  const { slug } = useParams();
  const cs = caseStudies.find((c) => c.slug === slug);

  useSeo({
    title: cs ? `${cs.title} — Case Study` : "Case study not found",
    description: cs ? cs.tagline : "",
    path: `/case-studies/${slug ?? ""}`,
    type: "article",
    noIndex: !cs,
  });

  if (!cs) return <Navigate to="/case-studies" replace />;

  return (
    <PageShell>
      <div className="container mx-auto px-6 max-w-4xl">
        <Link
          to="/case-studies"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={14} /> All case studies
        </Link>

        <header className="mb-10">
          <div className="text-sm text-primary uppercase tracking-widest font-semibold">
            {cs.client} · {cs.industry}
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight mt-3">{cs.title}</h1>
          <p className="text-lg text-muted-foreground mt-5 leading-relaxed">{cs.tagline}</p>

          <div className="flex flex-wrap items-center gap-5 mt-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock size={14} /> {cs.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> {cs.year}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {cs.tech.map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </header>

        <div className="rounded-2xl overflow-hidden mb-12">
          <img src={cs.heroImage} alt={cs.title} className="w-full h-auto" />
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {cs.results.map((r) => (
            <div key={r.label} className="glass rounded-xl p-5 text-center">
              <div className="font-heading text-2xl md:text-3xl font-bold gradient-text">{r.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{r.label}</div>
            </div>
          ))}
        </div>

        <section className="space-y-10 mb-14">
          <div>
            <h2 className="font-heading text-2xl font-bold mb-4">The Challenge</h2>
            <p className="text-muted-foreground leading-relaxed">{cs.challenge}</p>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold mb-4">Our Approach</h2>
            <p className="text-muted-foreground leading-relaxed">{cs.solution}</p>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold mb-4">The Outcome</h2>
            <p className="text-muted-foreground leading-relaxed">{cs.outcome}</p>
          </div>
        </section>

        <div className="glass rounded-2xl p-8 text-center">
          <h3 className="font-heading text-xl font-semibold">Want results like this?</h3>
          <p className="text-muted-foreground mt-2">Book a free 30-minute discovery call.</p>
          <div className="mt-5">
            <CalendlyDialog />
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default CaseStudy;
