import type { Metadata } from 'next';
import LeadAssessment from '@/components/LeadAssessment';
import { canonicalFor } from "@/lib/site-config";
import { ASSESSMENT_CONFIG } from "@/lib/assessment-config";

export const metadata: Metadata = {
  // Tied to the same flag the sitemap reads: a disabled assessment is left out
  // of the sitemap AND noindexed, so it is never indexable-but-orphaned.
  robots: ASSESSMENT_CONFIG.lead.enabled ? undefined : { index: false, follow: true },
  alternates: { canonical: canonicalFor("/lead-assessment") },
  title: 'Leadership Style Assessment — What Type of Leader Am I? | Learn2',
  description:
    'Free 5-minute leadership assessment. Discover your natural leadership style and the one thing your team most likely needs from you. Instant results plus a personalized email.',
  openGraph: {
    url: canonicalFor("/lead-assessment"),
    title: 'What Type of Leader Am I? Free Leadership Style Assessment',
    description:
      'Find out how you lead — and what your team actually needs from you. Five minutes. Ten questions. Instant results.',
  },
};

export default function LeadAssessmentPage() {
  return <LeadAssessment />;
}
