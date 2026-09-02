import Link from 'next/link';
import { canonicalFor, SITE_NAME } from "@/lib/site-config";
import CohortWaitlistForm from '@/components/CohortWaitlistForm';

export const metadata = {
  alternates: { canonical: canonicalFor("/certification") },
  openGraph: { url: canonicalFor("/certification") },
  title: `${SITE_NAME} Facilitator Certification - Build Capability In-House`,
  description: `Deliver ${SITE_NAME} inside your organization. Certification for two internal facilitators.`,
};

export default function CertificationPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 to-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-learn2-orange mb-4">Certification</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl mb-6 text-learn2-text">
            Deliver {SITE_NAME} for Your Organization
          </h1>
          <p className="text-xl text-learn2-gray mb-8 leading-relaxed">
            Certify your own facilitators. Deliver {SITE_NAME} to your teams. Build capability inside your organization.
          </p>
          <Link
            href="/contact"
            className="btn-primary"
          >
            Book a Discovery Call
          </Link>
        </div>
      </section>

      {/* The Opportunity */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-learn2-orange mb-4">The Opportunity</p>
          <h2 className="text-2xl md:text-3xl mb-10">Why Certification?</h2>
          <div className="space-y-6">
            <div className="flex gap-8">
              <div className="text-3xl flex-shrink-0">💰</div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-learn2-text">Sustainable Economics</h3>
                <p className="text-learn2-gray leading-relaxed">
                  Once you have certified facilitators, you can deliver to unlimited teams. The per-participant cost decreases. The value multiplies.
                </p>
              </div>
            </div>

            <div className="flex gap-8">
              <div className="text-3xl flex-shrink-0">🎯</div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-learn2-text">Customized to Your Context</h3>
                <p className="text-learn2-gray leading-relaxed">
                  Your facilitators know your culture. They speak your language. They can customize examples to your business. The experience lands better when it's delivered by someone who gets your world.
                </p>
              </div>
            </div>

            <div className="flex gap-8">
              <div className="text-3xl flex-shrink-0">⚡</div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-learn2-text">Scalable Impact</h3>
                <p className="text-learn2-gray leading-relaxed">
                  Train two facilitators. They train others. You build capability quickly. What took a year of external facilitation now happens in a month.
                </p>
              </div>
            </div>

            <div className="flex gap-8">
              <div className="text-3xl flex-shrink-0">🔄</div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-learn2-text">Sustained Culture</h3>
                <p className="text-learn2-gray leading-relaxed">
                  When {SITE_NAME} becomes part of how you operate, it sticks. New team members learn the language early. It becomes how you work, not something that happened once.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 md:py-24 bg-learn2-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-learn2-orange mb-4">What You Get</p>
          <h2 className="text-2xl md:text-3xl mb-12">Certification Bundle Includes</h2>

          <div className="space-y-8">
            <div className="bg-white rounded-lg p-8 border-l-4 border-learn2-orange">
              <h3 className="text-xl mb-4 text-learn2-text">3 Experiences</h3>
              <p className="text-learn2-gray mb-4 leading-relaxed">
                Choose 3 of the 8 {SITE_NAME} experiences. You could choose any combination based on your organizational priorities.
              </p>
              <ul className="space-y-2 text-learn2-gray">
                <li className="flex gap-3">
                  <span className="text-learn2-orange font-bold">✓</span>
                  <span>Complete program materials and facilitator guides</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-learn2-orange font-bold">✓</span>
                  <span>Assessment platform with customization</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-learn2-orange font-bold">✓</span>
                  <span>Slides, handouts, and all participant materials</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-learn2-orange font-bold">✓</span>
                  <span>Digital library of scenarios and examples</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-8 border-l-4 border-learn2-orange">
              <h3 className="text-xl mb-4 text-learn2-text">Certification for 2 Facilitators</h3>
              <p className="text-learn2-gray mb-4 leading-relaxed">
                We certify two of your team members as {SITE_NAME} facilitators. They learn the framework deeply. They practice facilitation. They become the keepers of {SITE_NAME} for your organization.
              </p>
              <ul className="space-y-2 text-learn2-gray">
                <li className="flex gap-3">
                  <span className="text-learn2-orange font-bold">✓</span>
                  <span>3-day intensive certification program</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-learn2-orange font-bold">✓</span>
                  <span>Facilitation practice and coaching</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-learn2-orange font-bold">✓</span>
                  <span>Practice delivery with Doug's feedback</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-learn2-orange font-bold">✓</span>
                  <span>Ongoing support and consultation</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-8 border-l-4 border-learn2-orange">
              <h3 className="text-xl mb-4 text-learn2-text">Up to 30 Participants Per Program</h3>
              <p className="text-learn2-gray mb-4 leading-relaxed">
                You get the facilitator materials and capacity to deliver to up to 30 participants in each program. After that, you can license additional cohorts.
              </p>
              <ul className="space-y-2 text-learn2-gray">
                <li className="flex gap-3">
                  <span className="text-learn2-orange font-bold">✓</span>
                  <span>Assessment for all participants</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-learn2-orange font-bold">✓</span>
                  <span>All participant materials and handouts</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-learn2-orange font-bold">✓</span>
                  <span>Email reports for all participants</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-learn2-orange font-bold">✓</span>
                  <span>Support for multiple cohorts</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-8 border-l-4 border-learn2-orange">
              <h3 className="text-xl mb-4 text-learn2-text">Ongoing Support</h3>
              <p className="text-learn2-gray mb-4 leading-relaxed">
                After certification, you're not alone. We stay connected and support your facilitators.
              </p>
              <ul className="space-y-2 text-learn2-gray">
                <li className="flex gap-3">
                  <span className="text-learn2-orange font-bold">✓</span>
                  <span>Monthly check-ins with your facilitators</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-learn2-orange font-bold">✓</span>
                  <span>Access to an exclusive facilitator community</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-learn2-orange font-bold">✓</span>
                  <span>Updates and new content as it's developed</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-learn2-orange font-bold">✓</span>
                  <span>Direct access to Doug for complex questions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-learn2-orange mb-4">The Process</p>
          <h2 className="text-2xl md:text-3xl mb-12">How Certification Works</h2>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="text-5xl font-bold text-learn2-orange flex-shrink-0">1</div>
              <div>
                <h3 className="text-xl mb-3 text-learn2-text">Discovery Call</h3>
                <p className="text-learn2-gray leading-relaxed">
                  We talk about your organization. Your priorities. Which three programs make the most sense. Who your two facilitators will be. What success looks like for you.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="text-5xl font-bold text-learn2-orange flex-shrink-0">2</div>
              <div>
                <h3 className="text-xl mb-3 text-learn2-text">Facilitator Selection</h3>
                <p className="text-learn2-gray leading-relaxed">
                  You identify two facilitators. Ideally, one who is naturally strong at connecting with people. One who is naturally strong at driving results. Together, they complement each other and model the concepts.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="text-5xl font-bold text-learn2-orange flex-shrink-0">3</div>
              <div>
                <h3 className="text-xl mb-3 text-learn2-text">Certification Program</h3>
                <p className="text-learn2-gray leading-relaxed">
                  Your facilitators attend a 3-day intensive certification. They learn the framework deeply. They practice facilitation. They get coached by Doug. They practice delivering with real participants.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="text-5xl font-bold text-learn2-orange flex-shrink-0">4</div>
              <div>
                <h3 className="text-xl mb-3 text-learn2-text">First Delivery</h3>
                <p className="text-learn2-gray leading-relaxed">
                  Your facilitators deliver the first program to your organization. Doug observes and provides feedback. Adjustments are made. By the end of the first program, they're ready to go.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="text-5xl font-bold text-learn2-orange flex-shrink-0">5</div>
              <div>
                <h3 className="text-xl mb-3 text-learn2-text">Ongoing Support</h3>
                <p className="text-learn2-gray leading-relaxed">
                  Your facilitators are part of an ongoing community. Monthly check-ins. Access to new resources. Support when questions come up. Doug stays connected to your program's success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="py-16 md:py-24 bg-learn2-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-learn2-orange mb-4">Outcomes</p>
          <h2 className="text-2xl md:text-3xl mb-10">What You Get</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-8 border-l-4 border-learn2-orange">
              <h3 className="text-xl font-semibold mb-2 text-learn2-text">Certified Facilitators</h3>
              <p className="text-learn2-gray leading-relaxed">
                Two of your team members become experts in the {SITE_NAME} framework and skilled facilitators. They understand the content deeply and can customize for your context.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 border-l-4 border-learn2-orange">
              <h3 className="text-xl font-semibold mb-2 text-learn2-text">Scalable Program</h3>
              <p className="text-learn2-gray leading-relaxed">
                You can deliver to unlimited teams. Three programs means thirty participants per program type. You can run multiple cohorts. Scale based on your organizational needs.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 border-l-4 border-learn2-orange">
              <h3 className="text-xl font-semibold mb-2 text-learn2-text">Embedded Culture</h3>
              <p className="text-learn2-gray leading-relaxed">
                {SITE_NAME} becomes part of how you operate. The language sticks. New hires learn it early. It becomes a competitive advantage because your people understand how they work together.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 border-l-4 border-learn2-orange">
              <h3 className="text-xl font-semibold mb-2 text-learn2-text">Measurable Results</h3>
              <p className="text-learn2-gray leading-relaxed">
                Teams see improvements in communication speed, sales performance, leadership effectiveness, and team dynamics. You can measure the impact of your investment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-learn2-orange mb-4 text-center">Pricing</p>
          <h2 className="text-2xl md:text-3xl mb-10 text-center">Certification Investment</h2>
          <div className="bg-learn2-light rounded-lg p-8 border-2 border-learn2-orange">
            <p className="text-lg text-learn2-gray mb-6 leading-relaxed">
              Certification pricing is customized based on:
            </p>
            <ul className="space-y-3 text-learn2-gray mb-8">
              <li className="flex gap-3">
                <span className="text-learn2-orange font-bold">•</span>
                <span>Which 3 programs you select</span>
              </li>
              <li className="flex gap-3">
                <span className="text-learn2-orange font-bold">•</span>
                <span>Your organization size and geography</span>
              </li>
              <li className="flex gap-3">
                <span className="text-learn2-orange font-bold">•</span>
                <span>Facilitation capacity you need</span>
              </li>
              <li className="flex gap-3">
                <span className="text-learn2-orange font-bold">•</span>
                <span>Support level you want</span>
              </li>
            </ul>

            <p className="text-center">
              <Link
                href="/contact"
                className="btn-primary"
              >
                Get Pricing & Schedule a Call
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Public Cohort Waitlist Section */}
      <section id="cohort-waitlist" className="py-16 md:py-24 bg-learn2-light scroll-mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-learn2-orange mb-4 text-center">Public Cohort</p>
          <h2 className="text-2xl md:text-3xl mb-6 text-center">Join the July 2026 Cohort Waitlist</h2>
          <p className="text-lg text-learn2-gray mb-8 leading-relaxed text-center">
            A public cohort for individual facilitators. Consultants. Internal L&amp;D pros. Transitioning leaders. Team leaders who want to certify. Smaller commitment than the organizational path above. Limited capacity.
          </p>
          <ul className="space-y-3 text-learn2-gray mb-10 max-w-2xl mx-auto">
            <li className="flex gap-3">
              <span className="text-learn2-orange font-bold">✓</span>
              <span>$2,000 per seat. Cohort-based, not self-paced.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-learn2-orange font-bold">✓</span>
              <span>Learn to facilitate the three experiences you choose.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-learn2-orange font-bold">✓</span>
              <span>Practice with real peers. Coached by Doug directly.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-learn2-orange font-bold">✓</span>
              <span>Certified facilitators join the Learn2 facilitator network and earn when they deliver.</span>
            </li>
          </ul>
          <CohortWaitlistForm />
        </div>
      </section>

      {/* Final CTA Section — organizational path */}
      <section className="bg-learn2-orange text-white py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl mb-6">Build {SITE_NAME} Into Your Organization</h2>
          <p className="text-lg mb-8 opacity-95">
            For organizations certifying two internal facilitators and running multiple cohorts. Custom pricing, ongoing support, embedded culture.
          </p>
          <Link
            href="/contact"
            className="btn-outline"
          >
            Schedule a Discovery Call
          </Link>
        </div>
      </section>
    </>
  );
}
