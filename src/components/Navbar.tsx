import { useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/data/constants";
import TechSutraLogo from "./TechSutraLogo";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const Navbar = ({ menuOpen, setMenuOpen }: NavbarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <a
          href="#home"
          className="hover:scale-105 transition-transform duration-300"
        >
          <TechSutraLogo size="sm" showTagline={false} />
        </a>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              {l.label}
            </a>
          ))}
          <ThemeToggle />
          <a
            href="#contact"
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Hire Us
          </a>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-foreground"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden glass border-t border-border/50 px-6 pb-6 space-y-4">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block text-muted-foreground hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="block w-full text-center px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold"
          >
            Hire Us
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
