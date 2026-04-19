import { useState } from "react";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Loader2,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { User, Mail, MessageCircle, Phone, MapPin, Send } from "lucide-react";

export function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
        setSubmitted(true);
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

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-up">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full animate-pulse" />
          <CheckCircle2 className="w-20 h-20 text-green-500 relative animate-bounce" />
        </div>
        <h3 className="text-2xl font-heading font-bold mb-2 gradient-text">
          Request Submitted!
        </h3>
        <p className="text-muted-foreground max-w-sm">
          Thank you for reaching out. We'll review your request and get back to
          you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div>
        <h2 className="text-3xl font-heading font-bold mb-6 gradient-text">
          Get In Touch
        </h2>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 group">
            <label
              htmlFor="name"
              className="flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <User className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all hover:border-primary/30"
            />
          </div>

          <div className="space-y-2 group">
            <label
              htmlFor="email"
              className="flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <Mail className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="john@company.com"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all hover:border-primary/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 group">
            <label
              htmlFor="phone"
              className="flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <Phone className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all hover:border-primary/30"
            />
          </div>

          <div className="space-y-2 group">
            <label
              htmlFor="company"
              className="flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <Building2 className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
              Company Name
            </label>
            <input
              type="text"
              id="company"
              name="company"
              placeholder="Your Company"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all hover:border-primary/30"
            />
          </div>
        </div>

        <div className="space-y-2 group">
          <label
            htmlFor="projectType"
            className="flex items-center gap-2 text-sm font-medium text-foreground"
          >
            <Briefcase className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            Project Type
          </label>
          <select
            id="projectType"
            name="projectType"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all hover:border-primary/30 cursor-pointer"
          >
            <option value="">Select project type</option>
            <option value="Website">Website Design & Development</option>
            <option value="Web Application">Web Application</option>
            <option value="E-Commerce">E-Commerce Store</option>
            <option value="Mobile App">Mobile App Development</option>
            <option value="SaaS Platform">SaaS Platform</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="space-y-2 group">
          <label
            htmlFor="message"
            className="flex items-center gap-2 text-sm font-medium text-foreground"
          >
            <MessageSquare className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            Project Details *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder="Tell us about your project goals, timeline, budget, and any specific requirements..."
            className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all hover:border-primary/30 resize-none"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 group relative overflow-hidden px-6 py-4 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed glow-border"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  Submit Request
                  <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          By submitting, you agree to our{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
          . We'll never share your information.
        </p>
      </form>
    </div>
  );
}
