import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <a
          href="#home"
          className="font-heading text-xl font-bold gradient-text"
        >
          WebTechAvi<span className="text-primary">.</span>
        </a>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          Made with <Heart size={14} className="text-primary" /> by WebTechAvi
          Team © {new Date().getFullYear()}
        </p>
        <div className="flex gap-6">
          {["Privacy", "Terms", "Sitemap"].map((l) => (
            <a
              key={l}
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
