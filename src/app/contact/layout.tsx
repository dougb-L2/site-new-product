import type { Metadata } from "next";
import { canonicalFor } from "@/lib/site-config";

// /contact/page.tsx is a client component (uses form state) and cannot
// export metadata directly, so canonical + OG url live here.
export const metadata: Metadata = {
  title: 'Contact - Book a Discovery Call',
  description: "Let's talk about how Learn2 can help your team.",
  alternates: { canonical: canonicalFor("/contact") },
  openGraph: { url: canonicalFor("/contact") },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
