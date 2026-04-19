import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import PageShell from "@/components/PageShell";
import { useSeo } from "@/hooks/use-seo";
import { blogPosts } from "@/data/blog";

const Blog = () => {
  useSeo({
    title: "Blog — insights on web development, SEO, and growth",
    description:
      "Practical advice on web development, SEO, hiring agencies, and scaling digital products. Written by the TechSutra team.",
    path: "/blog",
  });

  return (
    <PageShell>
      <div className="container mx-auto px-6 max-w-5xl">
        <header className="mb-14 text-center">
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Blog</span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mt-3">
            Insights & <span className="gradient-text">Playbooks</span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Honest, practical writing on the web development decisions that move businesses.
          </p>
        </header>

        <div className="grid gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group glass rounded-2xl p-7 hover:border-primary/50 transition-all"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(post.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {post.readingTime}
                </span>
                {post.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                    {t}
                  </span>
                ))}
              </div>
              <h2 className="font-heading text-2xl font-semibold group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-muted-foreground mt-3 leading-relaxed">{post.excerpt}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-primary text-sm font-medium">
                Read article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
};

export default Blog;
