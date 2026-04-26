import Link from 'next/link';
import { canonicalFor } from "@/lib/site-config";
import { SITE_NAME } from "@/lib/site-config";

export const metadata = {
  alternates: { canonical: canonicalFor("/results") },
  openGraph: { url: canonicalFor("/results") },
  title: `Results & Case Studies - ${SITE_NAME}`,
  description: 'See the real results teams have achieved using Learn2 experiences.',
};

export default function ResultsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-learn2-orange mb-4">Proven Impact</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl mb-6 text-learn2-text">
            Results. Real Data. Real Teams.
          </h1>
          <p className="text-xl text-learn2-gray mb-8 leading-relaxed">
            {/* TODO: Replace with your product-specific results intro */}
            Learn2 experiences have helped teams at leading organizations improve communication, sales, and leadership. Here's what they've achieved.
          </p>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-learn2-orange mb-4">Client Stories</p>
          <h2 className="text-2xl md:text-3xl mb-12">Case Studies</h2>

          <div className="space-y-12">
            {/* TODO: Replace with your product-specific case studies */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 border-b border-gray-200">
                <h3 className="text-xl text-learn2-text mb-2">Client Name</h3>
                <p className="text-learn2-gray font-semibold">Brief description of the engagement</p>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div>
                    <p className="text-4xl font-bold text-learn2-orange mb-2">XX</p>
                    <p className="text-learn2-gray text-sm">Key metric label</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-learn2-orange mb-2">XX+</p>
                    <p className="text-learn2-gray text-sm">Key metric label</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-learn2-orange mb-2">X months</p>
                    <p className="text-learn2-gray text-sm">Key metric label</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-learn2-text mb-3">The Challenge</h4>
                  <p className="text-learn2-gray leading-relaxed">
                    Describe the challenge the client was facing before the engagement.
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-learn2-text mb-3">The Solution</h4>
                  <p className="text-learn2-gray leading-relaxed">
                    Describe the Learn2 experience that was delivered and how it was customized.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-learn2-text mb-3">The Results</h4>
                  <ul className="space-y-2 text-learn2-gray">
                    <li className="flex gap-3">
                      <span className="text-learn2-orange font-bold">✓</span>
                      <span>Result one</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-learn2-orange font-bold">✓</span>
                      <span>Result two</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-learn2-orange font-bold">✓</span>
                      <span>Result three</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 md:py-24 bg-learn2-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-learn2-orange mb-4 text-center">Key Metrics</p>
          <h2 className="text-2xl md:text-3xl mb-12 text-center">What We Consistently See</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* TODO: Replace with your product-specific metrics */}
            <div className="bg-white rounded-lg p-8 border-l-4 border-learn2-orange">
              <p className="text-3xl font-bold text-learn2-orange mb-2">XX%</p>
              <p className="text-learn2-gray font-semibold mb-3">Key metric title</p>
              <p className="text-learn2-gray text-sm leading-relaxed">
                Description of what this metric measures and how it improves.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 border-l-4 border-learn2-orange">
              <p className="text-3xl font-bold text-learn2-orange mb-2">80%+</p>
              <p className="text-learn2-gray font-semibold mb-3">Sustained behavior change</p>
              <p className="text-learn2-gray text-sm leading-relaxed">
                Over 80% of participants maintain the behaviors and approaches they develop for at least 6 months.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Works */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-learn2-orange mb-4">Our Difference</p>
          <h2 className="text-2xl md:text-3xl mb-10">Why These Results Happen</h2>
          <div className="space-y-6">
            <div className="flex gap-8">
              <div className="text-3xl flex-shrink-0">🎯</div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-learn2-text">Participant-Driven Learning</h3>
                <p className="text-learn2-gray leading-relaxed">
                  People don't change because a consultant tells them to. They change when they discover something true about themselves. Our experiences are designed for discovery, not instruction.
                </p>
              </div>
            </div>

            <div className="flex gap-8">
              <div className="text-3xl flex-shrink-0">🔄</div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-learn2-text">Practice in Real Scenarios</h3>
                <p className="text-learn2-gray leading-relaxed">
                  We don't use generic role plays. We use scenarios from your actual business. People practice with real situations. The change they practice in the room is easier to apply in the field.
                </p>
              </div>
            </div>

            <div className="flex gap-8">
              <div className="text-3xl flex-shrink-0">🤝</div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-learn2-text">Common Language for Difference</h3>
                <p className="text-learn2-gray leading-relaxed">
                  Once a team has a common language for their natural differences, communication improves dramatically. Conflict becomes understood difference. Misunderstanding becomes a learning opportunity.
                </p>
              </div>
            </div>

            <div className="flex gap-8">
              <div className="text-3xl flex-shrink-0">⚡</div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-learn2-text">Immediate Applicability</h3>
                <p className="text-learn2-gray leading-relaxed">
                  People can apply what they learn that very day. Back in their meetings. In their sales calls. In their leadership conversations. The change doesn't wait for tomorrow. It happens now.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-learn2-orange text-white py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl mb-6">See These Results in Your Organization</h2>
          <p className="text-lg mb-8 opacity-95">
            Every team has the same four natural approaches represented. When they understand how to use all four, performance improves. Let's talk about how we can help your team.
          </p>
          <Link
            href="/assessment"
            className="btn-outline"
          >
            Take the Assessment
          </Link>
        </div>
      </section>
    </>
  );
}
