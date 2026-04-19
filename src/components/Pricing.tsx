import { Check, Sparkles } from "lucide-react";
import { pricingTiers } from "@/data/pricing";

const Pricing = () => {
  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Transparent Pricing</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3">
            Packages That <span className="gradient-text">Scale With You</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Fixed-price packages for clarity. Custom quotes for everything else. No hidden fees, ever.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {pricingTiers.map((tier, i) => (
            <div
              key={tier.name}
              className={`relative glass rounded-2xl p-8 transition-all duration-500 animate-fade-up ${
                tier.highlighted
                  ? "border-primary/60 glow-border"
                  : "hover:border-primary/40"
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1">
                  <Sparkles size={12} /> {tier.cta}
                </div>
              )}
              <h3 className="font-heading text-xl font-bold">{tier.name}</h3>
              <p className="text-sm text-muted-foreground mt-1.5 min-h-[40px]">{tier.tagline}</p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-heading text-4xl font-bold gradient-text">{tier.priceINR}</span>
                {tier.priceUSD !== "Custom" && (
                  <span className="text-sm text-muted-foreground">/ {tier.priceUSD}</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{tier.period}</div>

              <ul className="mt-6 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`mt-8 w-full flex items-center justify-center px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                  tier.highlighted
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-border hover:bg-secondary"
                }`}
              >
                {tier.highlighted ? "Start Project" : tier.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-10">
          Need something bespoke? <a href="#contact" className="text-primary hover:underline">Request a custom quote →</a>
        </p>
      </div>
    </section>
  );
};

export default Pricing;
