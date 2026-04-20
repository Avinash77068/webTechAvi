import { useState } from "react";
import {
  Loader2,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Calendar,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import CalendlyDialog from "./CalendlyDialog";
import { brandInfo } from "@/data/constants";

export function Contact({ showThis }: { showThis: boolean }) {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      formData.append("access_key", "20c1ccce-6777-4ffc-a717-5ef6d3b6a1b3");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Request submitted successfully!", {
          description: "We'll get back to you within 24 hours.",
        });
        event.currentTarget.reset();
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      toast.error("Something went wrong", {
        description: "Please try again or contact us directly.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappHref = `https://wa.me/${brandInfo.whatsappNumber}?text=${encodeURIComponent(
    `Hi ${brandInfo.name}, I'd like to discuss a project.`,
  )}`;

  return (
    <section id="contact" className={`${showThis ? "py-24" : ""}`}>
      <div>
        <div className={`text-center mb-16 ${showThis ? "block" : "hidden"}`}>
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">
            Get In Touch
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3">
            Let's <span className="gradient-text">Work Together</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Tell us about your project — we'll reply with a free quote within 24
            hours.
          </p>
        </div>

        <div
          className={`max-w-6xl mx-auto ${showThis ? "grid lg:grid-cols-3 gap-8" : "max-w-2xl mx-auto"}`}
        >
          {/* Left Sidebar - Contact Info */}
          {showThis && (
            <aside className="lg:col-span-1 space-y-6">
              {/* Email */}
              <div className="glass rounded-xl p-5 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      EMAIL
                    </div>
                    <a
                      href={`mailto:${brandInfo.email}`}
                      className="font-medium text-sm hover:text-primary transition-colors"
                    >
                      {brandInfo.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="glass rounded-xl p-5 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      PHONE
                    </div>
                    <a
                      href={`tel:${brandInfo.phonePrimary}`}
                      className="font-medium text-sm hover:text-primary transition-colors"
                    >
                      {brandInfo.phoneDisplay}
                    </a>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="glass rounded-xl p-5 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      LOCATION
                    </div>
                    <div className="font-medium text-sm">
                      Noida, Uttar Pradesh, India
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass rounded-xl p-5 border border-border/50">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-4">
                  PREFER SOMETHING FASTER?
                </div>
                <div className="space-y-3">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-all hover:scale-105"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Us
                  </a>
                  <CalendlyDialog
                    triggerClassName="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border text-foreground font-semibold hover:bg-secondary transition-colors"
                    triggerLabel="Book a free call"
                    showIcon={true}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-center mt-4 pt-4 border-t border-border/50 flex items-center justify-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Avg. response in 3 hours (Mon–Sat, 10am–7pm IST)
                </div>
              </div>
            </aside>
          )}

          {/* Right Side - Contact Form */}
          <form
            onSubmit={onSubmit}
            className={`${showThis ? "lg:col-span-2" : ""} glass rounded-2xl p-8 border border-border/50 space-y-5`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-medium mb-2 block"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium mb-2 block"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="phone"
                  className="text-sm font-medium mb-2 block"
                >
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+91 7706897675"
                  className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="text-sm font-medium mb-2 block"
                >
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  placeholder="Optional"
                  className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="projectType"
                  className="text-sm font-medium mb-2 block"
                >
                  Project Type
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
                >
                  <option value="">Select one</option>
                  <option value="Landing Page">Landing page</option>
                  <option value="Business Website">Business website</option>
                  <option value="E-Commerce">E-commerce store</option>
                  <option value="Web App / SaaS">Web app / SaaS</option>
                  <option value="Redesign">Redesign / revamp</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="budget"
                  className="text-sm font-medium mb-2 block"
                >
                  Budget
                </label>
                <select
                  id="budget"
                  name="budget"
                  className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
                >
                  <option value="">Select range</option>
                  <option value="< ₹50k">Under ₹50k</option>
                  <option value="₹50k–₹1L">₹50k – ₹1L</option>
                  <option value="₹1L–₹3L">₹1L – ₹3L</option>
                  <option value="₹3L–₹10L">₹3L – ₹10L</option>
                  <option value="₹10L+">₹10L+</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="text-sm font-medium mb-2 block"
              >
                Tell us about your project{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Goals, timeline, must-have features, inspiration links..."
                className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>

            <p className="text-xs text-center text-muted-foreground">
              By submitting, you agree to our{" "}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
              . We'll never share your info.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
