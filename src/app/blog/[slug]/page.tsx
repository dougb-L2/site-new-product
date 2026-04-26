import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";
import {
  blogPosts,
  getPostBySlug,
  getAllSlugs,
} from "@/lib/blog-data";

// ─── Static Generation ──────────────────────────────────────────
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// ─── SEO Metadata ────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.ogTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    openGraph: {
      title: post.ogTitle,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.date,
      authors: ["Doug Bolger"],
      tags: [post.hub, ...post.keywords],
    },
    twitter: {
      card: "summary_large_image",
      title: post.ogTitle,
      description: post.metaDescription,
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
  };
}

// ─── Page Component ──────────────────────────────────────────────
export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  // Find related posts (same hub, excluding current)
  const relatedPosts = blogPosts
    .filter((p) => p.hub === post.hub && p.id !== post.id)
    .slice(0, 2);

  // Parse inline formatting: **bold** and [link](url)
  function parseInline(text: string): React.ReactNode[] {
    // Split on bold and link patterns
    const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, j) => {
      // Bold
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={j} className="font-semibold">
            {part.replace(/\*\*/g, "")}
          </strong>
        );
      }
      // Link
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const [, linkText, url] = linkMatch;
        const isExternal = url.startsWith("http");
        return (
          <a
            key={j}
            href={url}
            className="text-learn2-orange hover:text-orange-sky underline transition"
            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {linkText}
          </a>
        );
      }
      // Plain text
      return <span key={j}>{part}</span>;
    });
  }

  // Parse markdown-style content into sections
  const sections = post.content.split("\n\n").map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="text-2xl md:text-3xl text-learn2-text mt-14 mb-6"
        >
          {parseInline(block.replace("## ", ""))}
        </h2>
      );
    }
    if (block.startsWith("**") && block.endsWith("**")) {
      return (
        <p
          key={i}
          className="text-lg font-semibold text-learn2-text mb-4 leading-relaxed"
        >
          {parseInline(block)}
        </p>
      );
    }
    return (
      <p key={i} className="text-learn2-text text-lg leading-relaxed mb-6">
        {parseInline(block)}
      </p>
    );
  });

  // JSON-LD structured data for search engines and AI
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "Doug Bolger",
      jobTitle: "CEO",
      worksFor: {
        "@type": "Organization",
        name: "Learn2 Learning Experiences Inc.",
      },
    },
    publisher: {
      "@type": "Organization",
      name: "Learn2",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    keywords: post.keywords.join(", "),
    articleSection: post.hub,
  };

  // BreadcrumbList structured data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE_URL}/blog/${post.slug}`,
      },
    ],
  };

  const hubColorMap: Record<string, string> = {
    "gold-mine": "bg-yellow-100 text-[#CCAA00]",
    "blue-ocean": "bg-blue-100 text-[#0081C1]",
    "green-planet": "bg-green-100 text-[#16AD00]",
    "orange-sky": "bg-orange-100 text-[#F48B00]",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Article Header */}
      <section className="bg-gradient-to-br from-indigo-50 to-white py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-learn2-gray">
              <li><Link href="/" className="hover:text-learn2-orange transition">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/blog" className="hover:text-learn2-orange transition">Blog</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-learn2-text/60 truncate max-w-[200px]" aria-current="page">{post.title}</li>
            </ol>
          </nav>

          <span
            className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-6 ${hubColorMap[post.hubColor] || "bg-gray-100 text-gray-600"}`}
          >
            {post.hub}
          </span>

          <h1 className="text-3xl md:text-4xl lg:text-5xl text-learn2-text mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-learn2-gray">
            <span>By Doug Bolger</span>
            <span>|</span>
            <time dateTime={post.date}>{post.date}</time>
            <span>|</span>
            <span>{Math.max(2, Math.ceil(post.content.split(/\s+/).length / 230))} min read</span>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <article className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {sections}
        </div>
      </article>

      {/* Assessment CTA */}
      <section className="bg-learn2-dark py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl text-white mb-6">
            Discover Your Natural Approach
          </h2>
          <p className="text-lg text-gray-300 mb-10 leading-relaxed max-w-xl mx-auto">
            Five minutes. No account. No credit card. See which approach you
            default to and where your blind spots live.
          </p>
          <Link
            href="/assessment"
            className="btn-primary"
          >
            Take the Free Assessment
          </Link>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl text-learn2-text mb-10">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="block bg-white rounded-lg border border-gray-200 p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all group"
                >
                  <span
                    className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${hubColorMap[related.hubColor] || "bg-gray-100 text-gray-600"}`}
                  >
                    {related.hub}
                  </span>
                  <h3 className="text-lg font-bold text-learn2-text mb-3 group-hover:text-learn2-orange transition">
                    {related.title}
                  </h3>
                  <p className="text-sm text-learn2-gray leading-relaxed">
                    {related.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
