import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Mail, Phone, MapPin, Loader2, MessageCircle, Calendar } from "lucide-react";
import { toast } from "sonner";
import { contactInfo, brand } from "@/data/constants";
import CalendlyDialog from "./CalendlyDialog";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  budget: z.string().optional(),
  projectType: z.string().optional(),
  message: z.string().min(10, "Tell us a bit more about your project (min 10 characters)"),
  honeypot: z.string().max(0, "Spam detected").optional(),
});

type FormValues = z.infer<typeof schema>;

const iconMap = { Mail, Phone, MapPin };

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      budget: "",
      projectType: "",
      message: "",
      honeypot: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (values.honeypot) return;
    setSubmitting(true);
    try {
      const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error(`Submit failed (${res.status})`);
      } else {
        const subject = encodeURIComponent(`New inquiry from ${values.name}`);
        const body = encodeURIComponent(
          [
            `Name: ${values.name}`,
            `Email: ${values.email}`,
            values.phone ? `Phone: ${values.phone}` : null,
            values.company ? `Company: ${values.company}` : null,
            values.projectType ? `Project: ${values.projectType}` : null,
            values.budget ? `Budget: ${values.budget}` : null,
            "",
            values.message,
          ]
            .filter(Boolean)
            .join("\n"),
        );
        window.location.href = `mailto:${brand.email}?subject=${subject}&body=${body}`;
      }

      toast.success("Message sent!", {
        description: "We'll get back to you within 24 hours.",
      });
      reset();
    } catch (err) {
      toast.error("Something went wrong", {
        description: "Please try WhatsApp or email us directly.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappHref = `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
    "Hi TechSutra, I'd like to discuss a project.",
  )}`;

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Get In Touch</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3">
            Let's <span className="gradient-text">Work Together</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Tell us about your project — we'll reply with a free quote within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          <aside className="lg:col-span-2 space-y-4">
            {contactInfo.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap];
              const content = (
                <>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">{item.label}</div>
                    <div className="font-medium text-sm mt-0.5">{item.value}</div>
                  </div>
                </>
              );
              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-start gap-4 glass rounded-xl p-4 hover:border-primary/40 transition-colors"
                >
                  {content}
                </a>
              ) : (
                <div key={item.label} className="flex items-start gap-4 glass rounded-xl p-4">
                  {content}
                </div>
              );
            })}

            <div className="glass rounded-xl p-5 space-y-3">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Prefer something faster?</div>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors"
              >
                <MessageCircle size={16} /> WhatsApp Us
              </a>
              <CalendlyDialog
                triggerClassName="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-semibold hover:bg-secondary transition-colors"
                triggerLabel="Book a free call"
              />
              <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
                <Calendar size={12} className="inline mr-1" />
                Avg. response in 3 hours (Mon–Sat, 10am–7pm IST)
              </div>
            </div>
          </aside>

          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 glass rounded-2xl p-6 md:p-8 space-y-5" noValidate>
            <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden {...register("honeypot")} />

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="text-sm font-medium mb-1.5 block">
                  Name <span className="text-destructive">*</span>
                </label>
                <input
                  id="name"
                  {...register("name")}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Your name"
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium mb-1.5 block">
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="phone" className="text-sm font-medium mb-1.5 block">Phone / WhatsApp</label>
                <input
                  id="phone"
                  {...register("phone")}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label htmlFor="company" className="text-sm font-medium mb-1.5 block">Company</label>
                <input
                  id="company"
                  {...register("company")}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="projectType" className="text-sm font-medium mb-1.5 block">Project Type</label>
                <select
                  id="projectType"
                  {...register("projectType")}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
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
                <label htmlFor="budget" className="text-sm font-medium mb-1.5 block">Budget</label>
                <select
                  id="budget"
                  {...register("budget")}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
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
              <label htmlFor="message" className="text-sm font-medium mb-1.5 block">
                Tell us about your project <span className="text-destructive">*</span>
              </label>
              <textarea
                id="message"
                rows={5}
                {...register("message")}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                placeholder="Goals, timeline, must-have features, inspiration links…"
              />
              {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Sending…
                </>
              ) : (
                <>
                  <Send size={18} /> Send Message
                </>
              )}
            </button>

            <p className="text-xs text-muted-foreground text-center">
              By submitting, you agree to our{" "}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
              We'll never share your info.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
