import { Link } from "react-router-dom";
import PageShell from "@/components/PageShell";
import { useSeo } from "@/hooks/use-seo";
import { blogPosts } from "@/data/blog";
import { caseStudies } from "@/data/caseStudies";

const Sitemap = () => {
  useSeo({
    title: "Sitemap",
    description: "A complete list of pages on the TechSutra website.",
    path: "/sitemap",
  });

  return (
    <PageShell>
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="font-heading text-4xl font-bold mb-2">Sitemap</h1>
        <p className="text-muted-foreground mb-10">Every public page on this site.</p>

        <div className="grid sm:grid-cols-2 gap-10">
          <div>
            <h2 className="font-heading text-lg font-semibold mb-3">Main</h2>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-muted-foreground hover:text-primary" to="/">Home</Link></li>
              <li><a className="text-muted-foreground hover:text-primary" href="/#services">Services</a></li>
              <li><a className="text-muted-foreground hover:text-primary" href="/#portfolio">Work</a></li>
              <li><a className="text-muted-foreground hover:text-primary" href="/#process">Process</a></li>
              <li><a className="text-muted-foreground hover:text-primary" href="/#pricing">Pricing</a></li>
              <li><a className="text-muted-foreground hover:text-primary" href="/#team">Team</a></li>
              <li><a className="text-muted-foreground hover:text-primary" href="/#faq">FAQ</a></li>
              <li><a className="text-muted-foreground hover:text-primary" href="/#contact">Contact</a></li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-lg font-semibold mb-3">Case Studies</h2>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-muted-foreground hover:text-primary" to="/case-studies">All case studies</Link></li>
              {caseStudies.map((c) => (
                <li key={c.slug}>
                  <Link className="text-muted-foreground hover:text-primary" to={`/case-studies/${c.slug}`}>
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-lg font-semibold mb-3">Blog</h2>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-muted-foreground hover:text-primary" to="/blog">All articles</Link></li>
              {blogPosts.map((p) => (
                <li key={p.slug}>
                  <Link className="text-muted-foreground hover:text-primary" to={`/blog/${p.slug}`}>
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-lg font-semibold mb-3">Legal</h2>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-muted-foreground hover:text-primary" to="/privacy">Privacy Policy</Link></li>
              <li><Link className="text-muted-foreground hover:text-primary" to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default Sitemap;
