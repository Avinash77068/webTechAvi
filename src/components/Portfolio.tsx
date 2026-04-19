import { Github, ExternalLink } from "lucide-react";
import { projects } from "@/data/projects";

const Portfolio = () => {
  return (
    <section id="portfolio" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Our Work</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3">Recent <span className="gradient-text">Projects</span></h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">We've built 15+ websites and applications with GitHub source code and live demos.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <div key={p.title} className={`group relative overflow-hidden rounded-2xl glass hover:border-primary/50 transition-all duration-500 animate-fade-up stagger-${(i % 6) + 1}`}>
              <div className="overflow-hidden rounded-t-xl aspect-video">
                <img src={p.img} alt={p.title} width={800} height={512} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-heading font-semibold">{p.title}</h3>
                    <span className="text-xs text-muted-foreground">{p.category}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <a href={p.github} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white text-sm text-foreground hover:bg-gray-100 text-black font-semibold transition-colors">
                    <Github size={14} />GitHub
                  </a>
                  <a href={p.live} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white text-sm text-primary hover:bg-gray-100 text-black font-semibold transition-colors">
                    <ExternalLink size={14} />Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
