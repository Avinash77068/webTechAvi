import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import Team from "@/components/Team";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useSeo } from "@/hooks/use-seo";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";
import { brand } from "@/data/constants";

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useSeo({
    title: `${brand.name} — Web Development Agency in Noida, India`,
    description: brand.description,
    path: "/",
  });
  useScrollToHash();

  return (
    <div className="min-h-screen">
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        <Hero />
        <Services />
        <Process />
        <Portfolio />
        <Testimonials />
        <Pricing />
        <Team />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
