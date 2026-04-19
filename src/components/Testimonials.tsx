import { Quote, Star } from "lucide-react";
import { testimonials, clientLogos } from "@/data/testimonials";

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Testimonials</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3">
            Trusted By <span className="gradient-text">Founders & Teams</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            We measure success by the growth our clients see after launch.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="glass rounded-2xl p-7 hover:border-primary/40 transition-all duration-500 animate-fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <Quote size={22} className="text-primary/60" />
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={14} className="fill-primary text-primary" />
                  ))}
                </div>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90 mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center font-heading font-semibold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-10">
          <p className="text-center text-xs text-muted-foreground uppercase tracking-widest mb-6">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
            {clientLogos.map((logo) => (
              <span key={logo} className="font-heading text-lg font-semibold text-muted-foreground">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
