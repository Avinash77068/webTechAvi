import { Github, Linkedin, Twitter } from "lucide-react";
import { team } from "@/data/team";

const Team = () => {
  return (
    <section id="team" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Our Team</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3">
            Meet The <span className="gradient-text">Developers</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            A small, senior team that works directly with you — no juniors, no hand-offs.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((m, i) => (
            <div
              key={m.name}
              className="group glass rounded-2xl p-8 text-center hover:border-primary/50 transition-all duration-500 animate-fade-up"
              style={{ animationDelay: `${(i % 6) * 0.1}s` }}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-secondary/20 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                {m.avatar ? (
                  <img
                    src={m.avatar}
                    alt={m.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span className="font-heading text-xl font-bold text-primary">{m.initials}</span>
                )}
              </div>
              <h3 className="font-heading text-lg font-semibold">{m.name}</h3>
              <p className="text-sm text-primary mt-1">{m.role}</p>
              {m.bio && <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{m.bio}</p>}
              <div className="flex items-center justify-center gap-2 mt-5">
                {m.linkedin && (
                  <a
                    aria-label={`${m.name} on LinkedIn`}
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Linkedin size={14} />
                  </a>
                )}
                {m.github && (
                  <a
                    aria-label={`${m.name} on GitHub`}
                    href={m.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Github size={14} />
                  </a>
                )}
                {m.twitter && (
                  <a
                    aria-label={`${m.name} on Twitter`}
                    href={m.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Twitter size={14} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
