import { processSteps } from "@/data/process";

const Process = () => {
  return (
    <section id="process" className="py-24 bg-card/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">How We Work</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3">
            Our <span className="gradient-text">Process</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            A transparent, battle-tested workflow that keeps projects on time and on budget.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {processSteps.map((step, i) => (
            <div
              key={step.number}
              className="group glass rounded-2xl p-6 hover:border-primary/50 transition-all duration-500 animate-fade-up relative"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-5xl font-heading font-bold text-primary/20 mb-4">
                {step.number}
              </div>
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <step.icon size={20} className="text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
