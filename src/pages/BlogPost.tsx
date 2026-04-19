import { Link, useParams, Navigate } from "react-router-dom";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import PageShell from "@/components/PageShell";
import CalendlyDialog from "@/components/CalendlyDialog";
import { useSeo } from "@/hooks/use-seo";
import { blogPosts } from "@/data/blog";

const renderMarkdown = (content: string) => {
  const blocks = content.split(/\n\n+/);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={i} className="font-heading text-2xl font-bold mt-10 mb-3">
          {trimmed.slice(3)}
        </h2>
      );
    }
    if (trimmed.startsWith("- ")) {
      const items = trimmed.split("\n").map((l) => l.replace(/^- /, ""));
      return (
        <ul key={i} className="list-disc list-inside space-y-1.5 my-4 text-muted-foreground">
          {items.map((it, idx) => (
            <li key={idx}>{it}</li>
          ))}
        </ul>
      );
    }
    if (trimmed.startsWith("|")) {
      return (
        <pre key={i} className="my-4 text-sm text-muted-foreground whitespace-pre-wrap font-mono">
          {trimmed}
        </pre>
      );
    }
    return (
      <p key={i} className="text-muted-foreground leading-relaxed my-4">
        {trimmed}
      </p>
    );
  });
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  useSeo({
    title: post ? post.title : "Article not found",
    description: post ? post.excerpt : "",
    path: `/blog/${slug ?? ""}`,
    type: "article",
    noIndex: !post,
  });

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <PageShell>
      <article className="container mx-auto px-6 max-w-3xl">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={14} /> All articles
        </Link>

        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {new Date(post.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {post.readingTime} read
            </span>
            {post.tags.map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                {t}
              </span>
            ))}
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight">{post.title}</h1>
          <p className="text-lg text-muted-foreground mt-5 leading-relaxed">{post.excerpt}</p>
          <p className="text-sm text-muted-foreground mt-6">By {post.author}</p>
        </header>

        <div className="prose prose-invert max-w-none">{renderMarkdown(post.content)}</div>

        <div className="mt-16 glass rounded-2xl p-8 text-center">
          <h3 className="font-heading text-xl font-semibold">Thinking about a project?</h3>
          <p className="text-muted-foreground mt-2">Get a free quote and sample plan within 24 hours.</p>
          <div className="mt-5">
            <CalendlyDialog />
          </div>
        </div>
      </article>
    </PageShell>
  );
};

export default BlogPost;
