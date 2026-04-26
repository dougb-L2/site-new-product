import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import GoogleTagManager from '@/components/GoogleTagManager';
import ConversionTracker from '@/components/ConversionTracker';
import RouteChangeTracker from '@/components/RouteChangeTracker';
import { SITE_URL, SITE_NAME } from '@/lib/site-config';
import './globals.css';

const ChatWidget = dynamic(() => import('@/components/ChatWidget'));

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

// NOTE: do NOT set `alternates.canonical` or `openGraph.url` here.
// Each page.tsx must provide its own canonical via `canonicalFor()` from
// `@/lib/site-config`. Setting a canonical at the layout level causes every
// child page to silently inherit the homepage canonical, which blocks
// indexing (see seo-guardrails.md).
export const metadata: Metadata = {
  title: `${SITE_NAME} - Participant-Driven Experiences`,
  description: 'Participant-driven experiences that change how your team works. Built by Learn2.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
      </head>
      <body className="bg-white text-learn2-text">
        <GoogleAnalytics />
        <GoogleTagManager />
        <ConversionTracker />
        <RouteChangeTracker />
        <Header />
        <main>{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-learn2-orange">{SITE_NAME}</span>
            <span className="text-xs text-learn2-gray">by Learn2</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {/* Add your product page links here */}
            <Link href="/results" className="text-sm font-medium text-learn2-text hover:text-learn2-orange transition">
              Results
            </Link>
            <Link href="/blog" className="text-sm font-medium text-learn2-text hover:text-learn2-orange transition">
              Blog
            </Link>
            <Link
              href="/assessment"
              className="btn-primary !py-2.5 !px-6 !text-xs"
            >
              Take the Assessment
            </Link>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <Link href="/blog" className="text-sm font-medium text-learn2-text hover:text-learn2-orange transition">
              Blog
            </Link>
            <Link
              href="/assessment"
              className="btn-primary !py-2.5 !px-6 !text-xs"
            >
              Take the Assessment
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-learn2-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div>
            <h3 className="text-lg font-semibold mb-4">{SITE_NAME}</h3>
            <p className="text-sm text-gray-300">Participant-driven experiences that change how your team works. Built by Learn2.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Experiences</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              {/* Add your product experience links here */}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/about" className="hover:text-learn2-orange transition">About</Link></li>
              <li><Link href="/results" className="hover:text-learn2-orange transition">Results</Link></li>
              <li><Link href="/certification" className="hover:text-learn2-orange transition">Certification</Link></li>
              <li><Link href="/contact" className="hover:text-learn2-orange transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="tel:+14164106434" className="hover:text-learn2-orange transition">+1 416-410-6434</a></li>
              <li><a href="mailto:sales@Learn2.com" className="hover:text-learn2-orange transition">sales@Learn2.com</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>Powered by <a href="https://learn2.com" className="text-learn2-orange hover:text-white transition">Learn2.com</a></p>
        </div>
      </div>
    </footer>
  );
}
