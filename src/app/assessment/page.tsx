import type { Metadata } from 'next';
import Assessment from '@/components/Assessment';
import { canonicalFor } from "@/lib/site-config";
import { ASSESSMENT_CONFIG } from "@/lib/assessment-config";

export const metadata: Metadata = {
  // Tied to the same flag the sitemap reads: a disabled assessment is left out
  // of the sitemap AND noindexed, so it is never indexable-but-orphaned.
  robots: ASSESSMENT_CONFIG.communicate.enabled ? undefined : { index: false, follow: true },
  alternates: { canonical: canonicalFor("/assessment") },
  title: 'Free Assessment - Discover Your Natural Approach',
  description: 'Discover your natural approach to communication, sales, and leadership in 5 minutes. Free. No credit card.',
  openGraph: {
    url: canonicalFor("/assessment"),
    title: 'Discover Your Natural Approach',
    description: 'Five minutes. Ten questions. See how you naturally approach communication, sales, and leadership.',
  },
};

export default function AssessmentPage() {
  return <Assessment />;
}
