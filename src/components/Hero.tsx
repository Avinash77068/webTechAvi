import { Sparkles, ArrowRight, Code2 } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { stats } from "@/data/constants";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>
      <div className="relative z-10 container mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground mb-8 animate-fade-up">
          <Sparkles size={14} className="text-primary" />
          <span>We Build Digital Experiences</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6 animate-fade-up stagger-1">
          Turning Ideas Into <span className="gradient-text">Stunning</span>
          <br />Websites & Apps
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10 animate-fade-up stagger-2">
          We build modern, responsive, and high-performance websites that take your business to the next level.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up stagger-3">
          <a href="#contact" className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all animate-pulse-glow">
            Start Your Project
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#portfolio" className="flex items-center gap-2 px-8 py-4 rounded-xl border border-border text-foreground font-semibold text-lg hover:bg-secondary transition-colors">
            <Code2 size={20} />View Our Work
          </a>
        </div>
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-up stagger-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-heading text-3xl md:text-4xl font-bold gradient-text">{s.num}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
