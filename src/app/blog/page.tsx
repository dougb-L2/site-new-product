import Link from 'next/link';
import { blogPosts, hubs } from '@/lib/blog-data';
import BlogGrid from '@/components/BlogGrid';
import { canonicalFor, SITE_NAME } from '@/lib/site-config';

export const metadata = {
  title: `Blog - Insights & Resources | ${SITE_NAME}`,
  description: 'Articles and insights on leadership, team dynamics, and participant-driven experiences. Practical wisdom from Learn2.',
  keywords: ['leadership', 'team building', 'participant-driven', 'team dynamics'],
  openGraph: {
    title: `Blog | ${SITE_NAME}`,
    description: 'Articles and insights on leadership, team dynamics, and participant-driven experiences.',
    type: 'website',
    url: canonicalFor('/blog'),
  },
  alternates: {
    canonical: canonicalFor('/blog'),
  },
};

// BlogGrid shows a post count on each filter button. Derive it from the posts
// so the numbers stay right as a new site fills in its own content.
const hubsWithCounts = hubs.map((hub) => ({
  ...hub,
  count: blogPosts.filter((post) => post.hub === hub.name).length,
}));

export default function BlogPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 to-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-learn2-gray mb-5">
            Insights &amp; Resources
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl mb-6 text-learn2-text">
            Blog
          </h1>
          <p className="text-xl text-learn2-gray leading-relaxed max-w-2xl">
            Articles and insights on communication, sales, leadership, and team dynamics. Practical wisdom for anyone trying to work with people who think differently than they do.
          </p>
        </div>
      </section>

      <BlogGrid posts={blogPosts} hubs={hubsWithCounts} />

      {/* Newsletter CTA */}
      <section className="py-16 md:py-24 bg-learn2-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl mb-6 text-learn2-text">Stay in the Loop</h2>
          <p className="text-lg text-learn2-gray mb-10">
            New articles every week on communication, sales, leadership, and teams. No spam. Just practical wisdom.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-5 py-4 rounded-lg border border-gray-200 text-learn2-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-learn2-orange"
            />
            <button
              type="submit"
              className="btn-primary"
            >
              Subscribe
            </button>
          </form>
          <p className="text-sm text-learn2-gray mt-6">We respect your inbox. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Related Resources CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl mb-6 text-learn2-text">Want to Go Deeper?</h2>
          <p className="text-lg text-learn2-gray mb-10 max-w-2xl mx-auto leading-relaxed">
            Read is one thing. Experience is another. Discover your natural approach with the free assessment. Then explore which experience could help your team.
          </p>
          <Link
            href="/assessment"
            className="btn-primary"
          >
            Take the Assessment
          </Link>
        </div>
      </section>
    </>
  );
}
