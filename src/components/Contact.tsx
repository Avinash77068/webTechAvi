import { Send, Mail, Phone, MapPin } from "lucide-react";
import { contactInfo } from "@/data/constants";

interface ContactProps {
  formData: { name: string; email: string; message: string };
  setFormData: (data: { name: string; email: string; message: string }) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const Contact = ({ formData, setFormData, handleSubmit }: ContactProps) => {
  const iconMap = {
    Mail,
    Phone,
    MapPin,
  };

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Get In Touch</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3">Let's <span className="gradient-text">Work Together</span></h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Tell us about your project - we'll reply within 24 hours.</p>
        </div>
        <div className="grid lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
          <div className="lg:col-span-2 space-y-6">
            {contactInfo.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap];
              return (
                <div key={item.label} className="flex items-start gap-4 glass rounded-xl p-5">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{item.label}</div>
                    <div className="font-medium">{item.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <form onSubmit={handleSubmit} className="lg:col-span-3 glass rounded-2xl p-8 space-y-5">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Name</label>
              <input 
                type="text" 
                required 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                className="w-full px-4 py-3 rounded-xl bg-white border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                placeholder="Your name" 
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
              <input 
                type="email" 
                required 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                className="w-full px-4 py-3 rounded-xl bg-white border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" 
                placeholder="you@example.com" 
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Message</label>
              <textarea 
                required 
                rows={4} 
                value={formData.message} 
                onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                className="w-full px-4 py-3 rounded-xl bg-white border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none" 
                placeholder="Tell us about your project..." 
              />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white text-black font-semibold hover:bg-gray-100 transition-colors">
              <Send size={18} />Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
