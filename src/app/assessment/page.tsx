import type { Metadata } from 'next';
import Assessment from '@/components/Assessment';
import { canonicalFor } from "@/lib/site-config";

export const metadata: Metadata = {
  alternates: { canonical: canonicalFor("/assessment") },
  openGraph: { url: canonicalFor("/assessment") },
  title: 'Free Naturally Assessment - Discover Your Natural Approach',
  description: 'Discover your natural approach to communication, sales, and leadership in 5 minutes. Free. No credit card.',
  openGraph: {
    title: 'Discover Your Natural Approach',
    description: 'Five minutes. Ten questions. See how you naturally approach communication, sales, and leadership.',
  },
};

export default function AssessmentPage() {
  return <Assessment />;
}
