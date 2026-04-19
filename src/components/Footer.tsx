import { Heart, Linkedin, Github, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { brand } from "@/data/constants";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border pt-16 pb-8 bg-card/30">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <Link to="/" className="font-heading text-2xl font-bold gradient-text">
              {brand.name}<span className="text-primary">.</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
              {brand.description}
            </p>
            <div className="flex gap-3 mt-5">
              <a aria-label="LinkedIn" href={brand.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-secondary/40 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Linkedin size={16} />
              </a>
              <a aria-label="GitHub" href={brand.social.github} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-secondary/40 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Github size={16} />
              </a>
              <a aria-label="Twitter" href={brand.social.twitter} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-secondary/40 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Twitter size={16} />
              </a>
              <a aria-label="Instagram" href={brand.social.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-secondary/40 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><a href="/#home" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="/#services" className="hover:text-primary transition-colors">Services</a></li>
              <li><a href="/#portfolio" className="hover:text-primary transition-colors">Work</a></li>
              <li><a href="/#team" className="hover:text-primary transition-colors">Team</a></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><a href="/#services" className="hover:text-primary transition-colors">Website Development</a></li>
              <li><a href="/#services" className="hover:text-primary transition-colors">E-Commerce Solutions</a></li>
              <li><a href="/#services" className="hover:text-primary transition-colors">UI / UX Design</a></li>
              <li><a href="/#services" className="hover:text-primary transition-colors">SEO & Analytics</a></li>
              <li><a href="/#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Get in touch</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail size={14} className="mt-0.5 text-primary shrink-0" />
                <a href={`mailto:${brand.email}`} className="hover:text-primary transition-colors break-all">{brand.email}</a>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={14} className="mt-0.5 text-primary shrink-0" />
                <a href={`tel:${brand.phonePrimary}`} className="hover:text-primary transition-colors">{brand.phoneDisplay}</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 text-primary shrink-0" />
                <span>{brand.location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart size={14} className="text-primary" /> by {brand.name} © {year}
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link to="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
