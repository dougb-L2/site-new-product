import type { Metadata } from "next";
import Link from 'next/link';
import { canonicalFor } from "@/lib/site-config";
import { SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  alternates: { canonical: canonicalFor("/") },
  openGraph: { url: canonicalFor("/") },
};

export default function Home() {
  /* TODO: Replace these placeholder experiences with your product's experiences */
  const experiences = [
    {
      title: 'Experience One',
      description: 'Describe what participants discover and practice in this experience.',
      href: '/experience-one',
    },
    {
      title: 'Experience Two',
      description: 'Describe what participants discover and practice in this experience.',
      href: '/experience-two',
    },
    {
      title: 'Certification',
      description: 'Certify internal facilitators to deliver experiences across your organization.',
      href: '/certification',
    },
  ];

  /* TODO: Replace with your product's proof points */
  const proofPoints = [
    { number: '+XX%', label: 'Key metric', client: 'Client Name' },
    { number: '+XX%', label: 'Key metric', client: 'Client Name' },
    { number: 'Xx', label: 'Key metric', client: 'Client Name' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-learn2-dark py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-learn2-orange mb-6">
            {/* TODO: Replace with your product tagline */}
            Participant-Driven Experiences
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-white leading-tight">
            {/* TODO: Replace with your product headline */}
            Your team has untapped potential. We help them find it.
          </h1>
          <p className="text-xl md:text-2xl text-learn2-orange font-semibold mb-10">
            {/* TODO: Replace with your product subheadline */}
            Discover what changes when your team works naturally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Link href="/assessment" className="btn-primary text-base">
              Take the Free Assessment
            </Link>
            <Link href="/results" className="btn-outline text-base">
              See Results
            </Link>
          </div>
        </div>
      </section>

      {/* Proof Numbers */}
      <section className="bg-white py-10 md:py-14 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-8">
            {proofPoints.map((point, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-learn2-orange mb-2">
                  {point.number}
                </div>
                <div className="text-sm text-learn2-text font-semibold mb-1">{point.label}</div>
                <div className="text-xs text-learn2-gray">{point.client}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Four Approaches */}
      <section className="bg-learn2-light py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-learn2-orange mb-4">
            The Framework
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-learn2-text">
            Four natural approaches. Everyone has one.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Naturally Gold Mine', desc: 'Structure, facts, planning, responsible. Proof-driven.', border: 'border-gold-mine' },
              { name: 'Naturally Blue Ocean', desc: 'People, relationships, harmony, authentic. Trust-driven.', border: 'border-blue-ocean' },
              { name: 'Naturally Green Planet', desc: 'Ideas, innovation, process, ingenious. Future-driven.', border: 'border-green-planet' },
              { name: 'Naturally Orange Sky', desc: 'Action, results, speed, skillful. Results-driven.', border: 'border-orange-sky' },
            ].map((a, i) => (
              <div key={i} className={`border-t-4 ${a.border} pt-6`}>
                <h3 className="text-lg font-bold text-learn2-text mb-3">{a.name}</h3>
                <p className="text-learn2-gray text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-learn2-dark py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-learn2-orange mb-4">
            Get Started
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white">
            Three steps. Five minutes.
          </h2>

          <div className="space-y-10">
            {[
              { num: '1', title: 'Take the assessment.', desc: 'Five minutes. No account. No credit card. Discover your natural approach.' },
              { num: '2', title: 'Discover your approach.', desc: 'See where your team aligns and where the gaps live.' },
              { num: '3', title: 'Close the gap.', desc: 'Through facilitated experiences, your team learns to flex and adapt.' },
            ].map((step, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-learn2-orange text-white text-xl font-bold">
                    {step.num}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link href="/assessment" className="btn-primary text-base">
              Start the Assessment
            </Link>
          </div>
        </div>
      </section>

      {/* Experiences */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-learn2-orange mb-4">
            Experiences
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-learn2-text">
            {/* TODO: Replace with your product suite name */}
            The complete suite.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((exp) => (
              <Link key={exp.href} href={exp.href} className="group block">
                <h3 className="text-base font-bold text-learn2-orange mb-2 group-hover:text-orange-sky transition">{exp.title}</h3>
                <p className="text-sm text-learn2-gray leading-relaxed">{exp.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-learn2-light py-10 md:py-14 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold tracking-[0.2em] uppercase text-learn2-gray mb-8">
            Trusted by
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 text-learn2-text font-semibold text-sm tracking-wide">
            {/* TODO: Replace with your client logos or names */}
            <span>Client One</span>
            <span className="text-gray-300">&bull;</span>
            <span>Client Two</span>
            <span className="text-gray-300">&bull;</span>
            <span>Client Three</span>
          </div>
        </div>
      </section>

      {/* Risk Reversal */}
      <section className="bg-learn2-dark py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
            No risk. Real results.
          </h2>
          <div className="space-y-4 text-lg text-gray-300 mb-10">
            <p>Free assessment. No account needed.</p>
            <p>Pilot available. 4X ROI guarantee.</p>
          </div>
          <Link href="/assessment" className="btn-primary text-base">
            Take the Free Assessment
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-learn2-orange py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-white">
            {/* TODO: Replace with your product CTA */}
            Discover your team&apos;s natural advantage.
          </h2>
          <a href="/assessment" className="btn-outline text-base" style={{ borderColor: 'white' }}>
            Take the Free Assessment
          </a>
        </div>
      </section>
    </>
  );
}
