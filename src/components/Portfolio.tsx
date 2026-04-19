import { ArrowRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { projects } from "@/data/projects";

const Portfolio = () => {
  return (
    <section id="portfolio" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Our Work</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3">
            Recent <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            A selection of work across e-commerce, SaaS, and custom web apps. Some projects are under NDA — reach out for live links.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <article
              key={p.slug}
              className="group relative overflow-hidden rounded-2xl glass hover:border-primary/50 transition-all duration-500 animate-fade-up"
              style={{ animationDelay: `${(i % 6) * 0.1}s` }}
            >
              <div className="overflow-hidden aspect-video relative">
                <img
                  src={p.img}
                  alt={p.title}
                  width={800}
                  height={512}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {p.result && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-primary/90 text-primary-foreground text-xs font-semibold backdrop-blur-sm">
                    {p.result}
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">{p.category}</span>
                </div>
                <h3 className="font-heading font-semibold text-lg leading-tight">{p.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.summary}</p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {p.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-border/50 flex gap-3">
                  {p.hasCaseStudy ? (
                    <Link
                      to={`/case-studies/${p.slug}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      <FileText size={14} /> Read Case Study
                    </Link>
                  ) : (
                    <a
                      href="#contact"
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors"
                    >
                      Request details <ArrowRight size={14} />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/case-studies"
            className="inline-flex items-center gap-2 text-primary hover:underline font-semibold text-sm"
          >
            View all case studies <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
