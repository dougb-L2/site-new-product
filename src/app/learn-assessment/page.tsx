import type { Metadata } from 'next';
import LearnAssessment from '@/components/LearnAssessment';
import { canonicalFor } from "@/lib/site-config";
import { ASSESSMENT_CONFIG } from "@/lib/assessment-config";

export const metadata: Metadata = {
  // Tied to the same flag the sitemap reads: a disabled assessment is left out
  // of the sitemap AND noindexed, so it is never indexable-but-orphaned.
  robots: ASSESSMENT_CONFIG.learn.enabled ? undefined : { index: false, follow: true },
  alternates: { canonical: canonicalFor("/learn-assessment") },
  title: 'Free Learning Assessment - Discover How You Naturally Learn',
  description: 'Discover your natural approach to learning in 5 minutes. Free. No credit card.',
  openGraph: {
    url: canonicalFor("/learn-assessment"),
    title: 'Discover How You Naturally Learn',
    description: 'Five minutes. Ten questions. See how you naturally learn, grow, and pick up new skills.',
  },
};

export default function LearnAssessmentPage() {
  return <LearnAssessment />;
}
