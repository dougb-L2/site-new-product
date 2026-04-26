import Link from 'next/link';
import { canonicalFor, SITE_NAME } from "@/lib/site-config";

export const metadata = {
  alternates: { canonical: canonicalFor("/about") },
  openGraph: { url: canonicalFor("/about") },
  title: `About ${SITE_NAME} - Learn2 Learning Experiences`,
  description: `The story behind ${SITE_NAME} and why it matters.`,
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-learn2-orange mb-4">Our Story</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl mb-6 text-learn2-text">
            {/* TODO: Replace with your product story headline */}
            The Story Behind {SITE_NAME}
          </h1>
          <p className="text-xl text-learn2-gray leading-relaxed">
            {/* TODO: Replace with your product story intro */}
            Twenty-five years of watching teams struggle. One simple insight. Every team has four natural approaches. When they understand and use all four, everything changes.
          </p>
        </div>
      </section>

      {/* The Insight Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-learn2-orange mb-4">The Discovery</p>
          <h2 className="text-2xl md:text-3xl mb-10">The Insight</h2>
          <div className="space-y-8">
            <div>
              <p className="text-lg text-learn2-gray leading-relaxed mb-6">
                {/* TODO: Replace with your product-specific insight narrative */}
                Doug Bolger spent over 25 years designing and facilitating leadership and team experiences. He noticed something that most training programs miss.
              </p>

              <div className="bg-learn2-light rounded-lg p-8 border-l-4 border-learn2-orange">
                <p className="text-2xl font-semibold text-learn2-text mb-4">
                  Every team has the same four approaches represented. And when teams understand how to use all four, they perform better at everything.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Approach */}
      <section className="py-16 md:py-24 bg-learn2-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-learn2-orange mb-4">How We Work</p>
          <h2 className="text-2xl md:text-3xl mb-10">Our Approach</h2>
          <div className="space-y-8">
            <div className="flex gap-8">
              <div className="text-3xl">👥</div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-learn2-text">Participant-Driven</h3>
                <p className="text-learn2-gray leading-relaxed">
                  We don't lecture. We don't stand at the front of the room and tell people how to be. Participants drive the experience. They discover. They practice. They commit to change based on their own insights.
                </p>
              </div>
            </div>

            <div className="flex gap-8">
              <div className="text-3xl">⚡</div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-learn2-text">Results-Driven</h3>
                <p className="text-learn2-gray leading-relaxed">
                  Every experience is designed for real results. Better communication. Better sales. Better leadership. Better teams. We measure what changes. We don't measure seat time.
                </p>
              </div>
            </div>

            <div className="flex gap-8">
              <div className="text-3xl">🎯</div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-learn2-text">Grounded in Reality</h3>
                <p className="text-learn2-gray leading-relaxed">
                  We use real scenarios from your industry and your role. Not exercises. Not role plays that feel fake. Real situations that matter to your team. Practice in the room. Apply in the field.
                </p>
              </div>
            </div>

            <div className="flex gap-8">
              <div className="text-3xl">🤝</div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-learn2-text">Rooted in Respect</h3>
                <p className="text-learn2-gray leading-relaxed">
                  We believe every person shows up for good reason. Every perspective has value. When we respect this, people open up. When people open up, they change.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Team */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl mb-12">The Team Behind {SITE_NAME}</h2>
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <h3 className="text-xl mb-4 text-learn2-text">Doug Bolger</h3>
            <p className="text-learn2-gray leading-relaxed mb-6">
              Founder of Learn2 Learning Experiences Inc. Doug has spent 25+ years designing and facilitating experiences for teams and leaders. He's worked with American Express, Bell Canada, Prophix, EO, and Deloitte. He's an accomplished facilitator, speaker, and strategist. And he's relentlessly committed to one thing: helping teams understand each other and work together better.
            </p>
            <p className="text-learn2-gray leading-relaxed">
              Doug believes that people don't need to change who they are. They need to understand how they are. And they need to understand how the people around them are. From that understanding, better communication, sales, and leadership flow naturally.
            </p>
          </div>
        </div>
      </section>

      {/* Learn2 Connection */}
      <section className="py-16 md:py-24 bg-learn2-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl mb-10">Part of Learn2</h2>
          <p className="text-lg text-learn2-gray mb-8 leading-relaxed">
            {SITE_NAME} is a product of Learn2 Learning Experiences Inc., a Canadian company dedicated to designing participant-driven experiences that create real results.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-3 text-learn2-text">Our Mission</h3>
              <p className="text-learn2-gray leading-relaxed">
                We design experiences that help teams and leaders understand how they naturally think, communicate, and work. So they can do it better.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-3 text-learn2-text">Our Promise</h3>
              <p className="text-learn2-gray leading-relaxed">
                Every experience we design is grounded in real scenarios, driven by participant insight, and measured by real results. Not theory. Reality.
              </p>
            </div>
          </div>
          <div className="mt-10">
            <p className="text-center text-learn2-gray mb-4">
              Learn more about Learn2 Learning Experiences Inc.
            </p>
            <div className="text-center">
              <a href="https://learn2.com" className="btn-primary">
                Visit learn2.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-learn2-orange text-white py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl mb-6">Ready to Help Your Team Work Naturally?</h2>
          <p className="text-lg mb-8 opacity-95">
            Take the free assessment. See your natural approach. Then let's talk about how we could help your organization.
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
