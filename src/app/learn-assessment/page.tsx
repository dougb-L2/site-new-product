import type { Metadata } from 'next';
import LearnAssessment from '@/components/LearnAssessment';
import { canonicalFor } from "@/lib/site-config";

export const metadata: Metadata = {
  alternates: { canonical: canonicalFor("/learn-assessment") },
  openGraph: { url: canonicalFor("/learn-assessment") },
  title: 'Free Learn Naturally Assessment - Discover How You Naturally Learn',
  description: 'Discover your natural approach to learning in 5 minutes. Free. No credit card.',
  openGraph: {
    title: 'Discover How You Naturally Learn',
    description: 'Five minutes. Ten questions. See how you naturally learn, grow, and pick up new skills.',
  },
};

export default function LearnAssessmentPage() {
  return <LearnAssessment />;
}
