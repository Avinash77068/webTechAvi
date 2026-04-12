import { Github, Linkedin, Twitter } from "lucide-react";
import { team } from "@/data/team";

const Team = () => {
  return (
    <section id="team" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Our Team</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3">Meet The <span className="gradient-text">Developers</span></h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Our talented team that turns your ideas into reality.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((m, i) => (
            <div key={m.name} className={`group glass rounded-2xl p-8 text-center hover:border-primary/50 transition-all duration-500 animate-fade-up stagger-${(i % 6) + 1}`}>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-500">
                <img src={m.initials} alt={m.name} className="w-full h-full object-cover rounded-full" />
              </div>
              <h3 className="font-heading text-lg font-semibold">{m.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{m.role}</p>
              <div className="flex items-center justify-center gap-3 mt-5">
                {[Github, Linkedin, Twitter].map((Icon, idx) => (
                  <button key={idx} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                    <Icon size={14} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
