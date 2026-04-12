import { services } from "@/data/services";

const Services = () => {
  return (
    <section id="services" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">What We Do</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3">Our <span className="gradient-text">Services</span></h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">From concept to deployment, we handle everything your digital presence needs.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div key={s.title} className={`group glass rounded-2xl p-8 hover:border-primary/50 transition-all duration-500 cursor-default animate-fade-up stagger-${i + 1}`}>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <s.icon size={24} className="text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
